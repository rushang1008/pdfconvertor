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

export const useFileProcessing = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessResult | null>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get pure base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  // Process files using edge function (sends files as base64)
  const processFiles = useCallback(async (
    tool: string,
    files: File[],
    options: Record<string, string | number | boolean>,
  ): Promise<ProcessResult> => {
    setProcessing(true);
    setUploading(true);
    setProgress(0);
    setResult(null);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 10 + 3;
      });
    }, 400);

    try {
      // Convert files to base64
      setProgress(10);
      const filesData = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await fileToBase64(file),
        }))
      );
      
      setUploading(false);
      setProgress(30);

      console.log(`Processing ${tool} with ${filesData.length} files`);

      const { data, error } = await supabase.functions.invoke('process-pdf', {
        body: {
          tool,
          files: filesData,
          options,
          userId: user?.id,
        },
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('Processing error:', error);
        throw new Error(error.message || 'Processing failed');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Processing failed');
      }

      setProgress(100);

      // Save to file history if user is logged in
      if (user && data.filePath) {
        const { error: historyError } = await supabase
          .from('file_history')
          .insert({
            user_id: user.id,
            original_file_name: files[0]?.name || 'document',
            original_file_path: data.filePath,
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

    } catch (error: unknown) {
      clearInterval(progressInterval);
      setProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      
      const errorResult: ProcessResult = {
        success: false,
        error: errorMessage,
      };
      
      setResult(errorResult);
      toast.error(errorMessage);
      return errorResult;
    } finally {
      setProcessing(false);
      setUploading(false);
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
    processFiles,
    reset,
  };
};
