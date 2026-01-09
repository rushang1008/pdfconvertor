import {
  FilePlus,
  FileText,
  Combine,
  Scissors,
  Shrink,
  RotateCw,
  Lock,
  Unlock,
  Droplet,
  Sparkles,
  Wand2,
  FileOutput,
  FileInput,
  Image,
  FileSpreadsheet,
  Presentation,
  LucideIcon,
} from "lucide-react";

export interface ToolOption {
  id: string;
  label: string;
  type: "text" | "password" | "select" | "checkbox" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
}

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  color: "pdf" | "convert" | "secure" | "ai";
  acceptedTypes: string[];
  acceptedTypesLabel: string;
  options: ToolOption[];
  actionLabel: string;
  isPro?: boolean;
  multiple?: boolean;
}

export const toolConfigs: Record<string, ToolConfig> = {
  // PDF Tools
  create: {
    id: "create",
    title: "Create PDF",
    description: "Create PDF from text, images, or scratch",
    longDescription: "Create a new PDF document from text content or combine multiple images into a single PDF file.",
    icon: FilePlus,
    color: "pdf",
    acceptedTypes: [".txt", ".jpg", ".jpeg", ".png", ".webp"],
    acceptedTypesLabel: "TXT, JPG, PNG, WEBP",
    options: [
      {
        id: "pageSize",
        label: "Page Size",
        type: "select",
        options: [
          { value: "a4", label: "A4" },
          { value: "letter", label: "Letter" },
          { value: "legal", label: "Legal" },
        ],
        defaultValue: "a4",
      },
      {
        id: "orientation",
        label: "Orientation",
        type: "select",
        options: [
          { value: "portrait", label: "Portrait" },
          { value: "landscape", label: "Landscape" },
        ],
        defaultValue: "portrait",
      },
    ],
    actionLabel: "Create PDF",
    multiple: true,
  },
  edit: {
    id: "edit",
    title: "Edit PDF",
    description: "Modify text and reorder pages",
    longDescription: "Edit existing PDF documents by modifying text content, reordering pages, or adding annotations.",
    icon: FileText,
    color: "pdf",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [],
    actionLabel: "Open Editor",
  },
  merge: {
    id: "merge",
    title: "Merge PDF",
    description: "Combine multiple PDFs into one",
    longDescription: "Merge multiple PDF files into a single document. Drag and drop to reorder files before merging.",
    icon: Combine,
    color: "pdf",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [],
    actionLabel: "Merge PDFs",
    multiple: true,
  },
  split: {
    id: "split",
    title: "Split PDF",
    description: "Extract pages or split into parts",
    longDescription: "Split a PDF into multiple files or extract specific pages from your document.",
    icon: Scissors,
    color: "pdf",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "splitMode",
        label: "Split Mode",
        type: "select",
        options: [
          { value: "all", label: "Extract all pages" },
          { value: "range", label: "Page range" },
          { value: "every", label: "Every N pages" },
        ],
        defaultValue: "all",
      },
      {
        id: "pageRange",
        label: "Page Range (e.g., 1-3, 5, 7-10)",
        type: "text",
        placeholder: "1-3, 5, 7-10",
      },
    ],
    actionLabel: "Split PDF",
  },
  compress: {
    id: "compress",
    title: "Compress PDF",
    description: "Reduce file size while keeping quality",
    longDescription: "Compress your PDF files to reduce size while maintaining optimal quality for sharing or storage.",
    icon: Shrink,
    color: "pdf",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "quality",
        label: "Compression Level",
        type: "select",
        options: [
          { value: "low", label: "Low (smaller file)" },
          { value: "medium", label: "Medium (balanced)" },
          { value: "high", label: "High (better quality)" },
        ],
        defaultValue: "medium",
      },
    ],
    actionLabel: "Compress PDF",
  },
  rotate: {
    id: "rotate",
    title: "Rotate Pages",
    description: "Rotate PDF pages to any angle",
    longDescription: "Rotate all or specific pages in your PDF to portrait or landscape orientation.",
    icon: RotateCw,
    color: "pdf",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "rotation",
        label: "Rotation",
        type: "select",
        options: [
          { value: "90", label: "90° clockwise" },
          { value: "180", label: "180°" },
          { value: "270", label: "90° counter-clockwise" },
        ],
        defaultValue: "90",
      },
      {
        id: "pages",
        label: "Pages to Rotate",
        type: "select",
        options: [
          { value: "all", label: "All pages" },
          { value: "odd", label: "Odd pages only" },
          { value: "even", label: "Even pages only" },
        ],
        defaultValue: "all",
      },
    ],
    actionLabel: "Rotate Pages",
  },
  secure: {
    id: "secure",
    title: "Secure PDF",
    description: "Add password protection",
    longDescription: "Protect your PDF with a password to prevent unauthorized access or editing.",
    icon: Lock,
    color: "secure",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
      },
      {
        id: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm password",
      },
      {
        id: "allowPrinting",
        label: "Allow Printing",
        type: "checkbox",
        defaultValue: true,
      },
    ],
    actionLabel: "Secure PDF",
  },
  unlock: {
    id: "unlock",
    title: "Unlock PDF",
    description: "Remove password from PDF",
    longDescription: "Remove password protection from a PDF file. You must know the current password to unlock.",
    icon: Unlock,
    color: "secure",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "currentPassword",
        label: "Current Password",
        type: "password",
        placeholder: "Enter current password",
      },
    ],
    actionLabel: "Unlock PDF",
  },
  watermark: {
    id: "watermark",
    title: "Add Watermark",
    description: "Add text or image watermarks",
    longDescription: "Add text or image watermarks to your PDF pages for branding or protection.",
    icon: Droplet,
    color: "secure",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "watermarkText",
        label: "Watermark Text",
        type: "text",
        placeholder: "Enter watermark text",
      },
      {
        id: "opacity",
        label: "Opacity",
        type: "select",
        options: [
          { value: "25", label: "25%" },
          { value: "50", label: "50%" },
          { value: "75", label: "75%" },
          { value: "100", label: "100%" },
        ],
        defaultValue: "50",
      },
      {
        id: "position",
        label: "Position",
        type: "select",
        options: [
          { value: "center", label: "Center" },
          { value: "diagonal", label: "Diagonal" },
          { value: "top", label: "Top" },
          { value: "bottom", label: "Bottom" },
        ],
        defaultValue: "diagonal",
      },
    ],
    actionLabel: "Add Watermark",
  },
  ocr: {
    id: "ocr",
    title: "OCR Scanner",
    description: "Extract text from scanned PDFs",
    longDescription: "Use AI-powered OCR to extract text from scanned documents and images in your PDF.",
    icon: Sparkles,
    color: "ai",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "language",
        label: "Document Language",
        type: "select",
        options: [
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
          { value: "de", label: "German" },
          { value: "auto", label: "Auto-detect" },
        ],
        defaultValue: "auto",
      },
    ],
    actionLabel: "Extract Text",
    isPro: true,
  },
  detect: {
    id: "detect",
    title: "Smart Detect",
    description: "Auto-detect document type",
    longDescription: "AI-powered detection of document type with automatic suggestions for the best tools to use.",
    icon: Wand2,
    color: "ai",
    acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png", ".webp"],
    acceptedTypesLabel: "PDF, JPG, PNG",
    options: [],
    actionLabel: "Analyze Document",
    isPro: true,
  },

  // Convert Tools
  "pdf-to-word": {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF to editable DOCX",
    longDescription: "Convert your PDF documents to editable Microsoft Word format while preserving formatting.",
    icon: FileOutput,
    color: "convert",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "preserveLayout",
        label: "Preserve Layout",
        type: "checkbox",
        defaultValue: true,
      },
    ],
    actionLabel: "Convert to Word",
  },
  "word-to-pdf": {
    id: "word-to-pdf",
    title: "Word to PDF",
    description: "Convert DOCX to PDF format",
    longDescription: "Convert Microsoft Word documents to PDF format for easy sharing and printing.",
    icon: FileInput,
    color: "convert",
    acceptedTypes: [".doc", ".docx"],
    acceptedTypesLabel: "DOC, DOCX",
    options: [],
    actionLabel: "Convert to PDF",
  },
  "pdf-to-image": {
    id: "pdf-to-image",
    title: "PDF to Image",
    description: "Export PDF pages as JPG/PNG",
    longDescription: "Convert PDF pages to high-quality JPG or PNG images for use anywhere.",
    icon: Image,
    color: "convert",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "format",
        label: "Image Format",
        type: "select",
        options: [
          { value: "jpg", label: "JPG" },
          { value: "png", label: "PNG" },
        ],
        defaultValue: "jpg",
      },
      {
        id: "quality",
        label: "Quality",
        type: "select",
        options: [
          { value: "72", label: "72 DPI (Web)" },
          { value: "150", label: "150 DPI (Standard)" },
          { value: "300", label: "300 DPI (Print)" },
        ],
        defaultValue: "150",
      },
    ],
    actionLabel: "Convert to Images",
  },
  "image-to-pdf": {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert images to PDF document",
    longDescription: "Combine multiple images into a single PDF document with customizable page settings.",
    icon: FilePlus,
    color: "convert",
    acceptedTypes: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"],
    acceptedTypesLabel: "JPG, PNG, WEBP, GIF, BMP",
    options: [
      {
        id: "pageSize",
        label: "Page Size",
        type: "select",
        options: [
          { value: "a4", label: "A4" },
          { value: "letter", label: "Letter" },
          { value: "fit", label: "Fit to Image" },
        ],
        defaultValue: "a4",
      },
      {
        id: "orientation",
        label: "Orientation",
        type: "select",
        options: [
          { value: "auto", label: "Auto" },
          { value: "portrait", label: "Portrait" },
          { value: "landscape", label: "Landscape" },
        ],
        defaultValue: "auto",
      },
      {
        id: "margin",
        label: "Margin",
        type: "select",
        options: [
          { value: "none", label: "No Margin" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
        ],
        defaultValue: "small",
      },
    ],
    actionLabel: "Create PDF",
    multiple: true,
  },
  "pdf-to-excel": {
    id: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Extract tables to spreadsheet",
    longDescription: "Extract tables from PDF documents and convert them to Excel spreadsheets.",
    icon: FileSpreadsheet,
    color: "convert",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [
      {
        id: "detectTables",
        label: "Auto-detect Tables",
        type: "checkbox",
        defaultValue: true,
      },
    ],
    actionLabel: "Convert to Excel",
  },
  "pdf-to-ppt": {
    id: "pdf-to-ppt",
    title: "PDF to PPT",
    description: "Convert PDF to presentation",
    longDescription: "Convert PDF documents to PowerPoint presentations while preserving layout.",
    icon: Presentation,
    color: "convert",
    acceptedTypes: [".pdf"],
    acceptedTypesLabel: "PDF",
    options: [],
    actionLabel: "Convert to PPT",
  },
};

export const getToolConfig = (toolId: string): ToolConfig | null => {
  return toolConfigs[toolId] || null;
};
