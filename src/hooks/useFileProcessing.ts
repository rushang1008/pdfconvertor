import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProcessResult {
  success: boolean;
  downloadUrl?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  storagePath?: string;
  publicUrl?: string;
}

export const useFileProcessing = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessResult | null>(null);

  // Upload files to temporary storage
  const uploadFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    setUploading(true);
    const uploadedFiles: UploadedFile[] = [];

    try {
      for (const file of files) {
        const timestamp = Date.now();
        const userId = user?.id || 'guest';
        const filePath = `${userId}/temp/${timestamp}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('user-files')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        // Get signed URL for the uploaded file
        const { data: signedData } = await supabase.storage
          .from('user-files')
          .createSignedUrl(filePath, 3600);

        uploadedFiles.push({
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          storagePath: filePath,
          publicUrl: signedData?.signedUrl,
        });
      }

      return uploadedFiles;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [user]);

  // Process files using edge function
  const processFiles = useCallback(async (
    tool: string,
    fileUrls: string[],
    options: Record<string, string | number | boolean>,
    originalFileName: string
  ): Promise<ProcessResult> => {
    setProcessing(true);
    setProgress(0);
    setResult(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15 + 5;
      });
    }, 500);

    try {
      const { data, error } = await supabase.functions.invoke('process-pdf', {
        body: {
          tool,
          fileUrls,
          options,
          userId: user?.id,
        },
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('Processing error:', error);
        throw new Error(error.message || 'Processing failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      setProgress(100);

      // Save to file history if user is logged in
      if (user && data.filePath) {
        const { error: historyError } = await supabase
          .from('file_history')
          .insert({
            user_id: user.id,
            original_file_name: originalFileName,
            original_file_path: fileUrls[0],
            processed_file_name: data.fileName,
            processed_file_path: data.filePath,
            tool_used: tool,
            file_size: data.fileSize,
            status: 'completed',
          });

        if (historyError) {
          console.error('Error saving to history:', historyError);
        }
      }

      const processResult: ProcessResult = {
        success: true,
        downloadUrl: data.downloadUrl,
        filePath: data.filePath,
        fileName: data.fileName,
        fileSize: data.fileSize,
      };

      setResult(processResult);
      return processResult;

    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0);
      
      const errorResult: ProcessResult = {
        success: false,
        error: error.message || 'Processing failed',
      };
      
      setResult(errorResult);
      toast.error(error.message || 'Processing failed');
      return errorResult;
    } finally {
      setProcessing(false);
    }
  }, [user]);

  const reset = useCallback(() => {
    setProgress(0);
    setResult(null);
    setProcessing(false);
    setUploading(false);
  }, []);

  return {
    uploading,
    processing,
    progress,
    result,
    uploadFiles,
    processFiles,
    reset,
  };
};
