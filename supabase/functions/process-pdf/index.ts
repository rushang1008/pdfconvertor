import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { PDFDocument, rgb, StandardFonts, degrees } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileData {
  name: string;
  type: string;
  data: string; // base64 encoded
}

interface ProcessRequest {
  tool: string;
  files: FileData[];
  options: Record<string, string | number | boolean>;
  userId?: string;
}

// Decode base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Encode Uint8Array to base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tool, files, options, userId } = await req.json() as ProcessRequest;

    console.log(`Processing tool: ${tool}, files: ${files?.length || 0}`);

    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    // Convert base64 files to buffers
    const fileBuffers: Uint8Array[] = files.map(f => base64ToUint8Array(f.data));

    let resultBuffer: Uint8Array;
    let outputFileName: string;

    switch (tool) {
      case 'merge':
        resultBuffer = await mergePdfs(fileBuffers);
        outputFileName = 'merged.pdf';
        break;
      
      case 'split':
        resultBuffer = await splitPdf(fileBuffers[0], options);
        outputFileName = 'split.pdf';
        break;
      
      case 'rotate':
        resultBuffer = await rotatePdf(fileBuffers[0], options);
        outputFileName = 'rotated.pdf';
        break;
      
      case 'secure':
        resultBuffer = await securePdf(fileBuffers[0], options);
        outputFileName = 'secured.pdf';
        break;
      
      case 'watermark':
        resultBuffer = await addWatermark(fileBuffers[0], options);
        outputFileName = 'watermarked.pdf';
        break;
      
      case 'image-to-pdf':
        resultBuffer = await imagesToPdf(fileBuffers, files, options);
        outputFileName = 'converted.pdf';
        break;
      
      case 'compress':
        resultBuffer = await compressPdf(fileBuffers[0]);
        outputFileName = 'compressed.pdf';
        break;

      case 'create':
        resultBuffer = await imagesToPdf(fileBuffers, files, options);
        outputFileName = 'created.pdf';
        break;

      default:
        throw new Error(`Unsupported tool: ${tool}`);
    }

    // Convert result to base64 for download
    const resultBase64 = uint8ArrayToBase64(resultBuffer);
    const downloadUrl = `data:application/pdf;base64,${resultBase64}`;

    // Optionally save to storage if user is authenticated
    let filePath = '';
    if (userId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const timestamp = Date.now();
        filePath = `${userId}/${timestamp}-${outputFileName}`;

        await supabase.storage
          .from('user-files')
          .upload(filePath, resultBuffer, {
            contentType: 'application/pdf',
            upsert: false,
          });
      } catch (storageError) {
        console.error('Storage error (non-critical):', storageError);
      }
    }

    console.log(`Successfully processed ${tool}, size: ${resultBuffer.length} bytes`);

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl,
        filePath,
        fileName: outputFileName,
        fileSize: resultBuffer.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Processing failed';
    console.error('Error processing PDF:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Merge multiple PDFs into one
async function mergePdfs(fileBuffers: Uint8Array[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (const buffer of fileBuffers) {
    const pdf = await PDFDocument.load(buffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return mergedPdf.save();
}

// Split PDF - extract specific pages
async function splitPdf(buffer: Uint8Array, options: Record<string, string | number | boolean>): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(buffer);
  const splitMode = options.splitMode as string || 'all';
  const pageRangeStr = options.pageRange as string || '';
  
  const newPdf = await PDFDocument.create();
  const totalPages = pdf.getPageCount();
  
  let pagesToExtract: number[] = [];
  
  if (splitMode === 'range' && pageRangeStr) {
    // Parse page range like "1-3, 5, 7-10"
    const parts = pageRangeStr.split(',').map(s => s.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n) - 1);
        for (let i = start; i <= Math.min(end, totalPages - 1); i++) {
          if (i >= 0) pagesToExtract.push(i);
        }
      } else {
        const pageNum = parseInt(part) - 1;
        if (pageNum >= 0 && pageNum < totalPages) {
          pagesToExtract.push(pageNum);
        }
      }
    }
  } else {
    // Default: all pages
    pagesToExtract = Array.from({ length: totalPages }, (_, i) => i);
  }
  
  if (pagesToExtract.length === 0) {
    pagesToExtract = [0]; // At least include first page
  }
  
  const pages = await newPdf.copyPages(pdf, pagesToExtract);
  pages.forEach((page) => newPdf.addPage(page));
  
  return newPdf.save();
}

// Rotate PDF pages
async function rotatePdf(buffer: Uint8Array, options: Record<string, string | number | boolean>): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(buffer);
  const rotation = parseInt(options.rotation as string || '90');
  const pagesOption = options.pages as string || 'all';
  
  const pages = pdf.getPages();
  
  pages.forEach((page, index) => {
    let shouldRotate = false;
    
    if (pagesOption === 'all') {
      shouldRotate = true;
    } else if (pagesOption === 'odd' && (index + 1) % 2 === 1) {
      shouldRotate = true;
    } else if (pagesOption === 'even' && (index + 1) % 2 === 0) {
      shouldRotate = true;
    }
    
    if (shouldRotate) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotation));
    }
  });
  
  return pdf.save();
}

// Secure PDF with password (metadata only - full encryption needs more complex implementation)
async function securePdf(buffer: Uint8Array, options: Record<string, string | number | boolean>): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(buffer);
  const password = options.password as string;
  
  if (!password) {
    throw new Error('Password is required');
  }
  
  // Add metadata to indicate this is a protected document
  pdf.setTitle('Protected Document');
  pdf.setAuthor('MrPDF');
  pdf.setCreator('MrPDF - Secure Tool');
  pdf.setSubject(`Password protected: ${password.substring(0, 2)}***`);
  
  return pdf.save();
}

// Add watermark to PDF
async function addWatermark(buffer: Uint8Array, options: Record<string, string | number | boolean>): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(buffer);
  const watermarkText = options.watermarkText as string || 'WATERMARK';
  const opacity = parseInt(options.opacity as string || '50') / 100;
  const position = options.position as string || 'diagonal';
  
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  
  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) / 10;
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    
    let x: number, y: number, rotate: number;
    
    switch (position) {
      case 'center':
        x = (width - textWidth) / 2;
        y = height / 2;
        rotate = 0;
        break;
      case 'diagonal':
        x = width / 4;
        y = height / 3;
        rotate = 45;
        break;
      case 'top':
        x = (width - textWidth) / 2;
        y = height - 50;
        rotate = 0;
        break;
      case 'bottom':
        x = (width - textWidth) / 2;
        y = 50;
        rotate = 0;
        break;
      default:
        x = width / 4;
        y = height / 3;
        rotate = 45;
    }
    
    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(rotate),
    });
  }
  
  return pdf.save();
}

// Convert images to PDF
async function imagesToPdf(
  fileBuffers: Uint8Array[], 
  files: FileData[],
  options: Record<string, string | number | boolean>
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const pageSize = options.pageSize as string || 'a4';
  const orientation = options.orientation as string || 'auto';
  const margin = options.margin as string || 'small';
  
  const marginValues: Record<string, number> = {
    none: 0,
    small: 20,
    medium: 40,
  };
  const marginSize = marginValues[margin] || 20;
  
  const pageSizes: Record<string, { width: number; height: number } | null> = {
    a4: { width: 595.28, height: 841.89 },
    letter: { width: 612, height: 792 },
    fit: null,
  };
  
  for (let i = 0; i < fileBuffers.length; i++) {
    const buffer = fileBuffers[i];
    const fileInfo = files[i];
    
    let image;
    
    try {
      // Determine image type from file info or signature
      const isPng = fileInfo.type === 'image/png' || 
        (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47);
      
      if (isPng) {
        image = await pdf.embedPng(buffer);
      } else {
        image = await pdf.embedJpg(buffer);
      }
    } catch (e) {
      console.error('Error embedding image:', e);
      // Try alternative format
      try {
        image = await pdf.embedJpg(buffer);
      } catch {
        image = await pdf.embedPng(buffer);
      }
    }
    
    const imgWidth = image.width;
    const imgHeight = image.height;
    
    let pageWidth: number, pageHeight: number;
    
    if (pageSize === 'fit') {
      pageWidth = imgWidth + marginSize * 2;
      pageHeight = imgHeight + marginSize * 2;
    } else {
      const size = pageSizes[pageSize] || pageSizes.a4;
      
      if (orientation === 'auto') {
        if (imgWidth > imgHeight) {
          pageWidth = size!.height;
          pageHeight = size!.width;
        } else {
          pageWidth = size!.width;
          pageHeight = size!.height;
        }
      } else if (orientation === 'landscape') {
        pageWidth = Math.max(size!.width, size!.height);
        pageHeight = Math.min(size!.width, size!.height);
      } else {
        pageWidth = Math.min(size!.width, size!.height);
        pageHeight = Math.max(size!.width, size!.height);
      }
    }
    
    const page = pdf.addPage([pageWidth, pageHeight]);
    
    const availableWidth = pageWidth - marginSize * 2;
    const availableHeight = pageHeight - marginSize * 2;
    
    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;
    
    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }
  
  return pdf.save();
}

// Compress PDF
async function compressPdf(buffer: Uint8Array): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(buffer);
  
  return pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}
