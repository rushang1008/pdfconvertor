import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FileHistoryItem {
  id: string;
  original_file_name: string;
  original_file_path: string;
  processed_file_name: string | null;
  processed_file_path: string | null;
  tool_used: string;
  file_size: number | null;
  status: string | null;
  created_at: string;
}

export const useFileHistory = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("file_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching file history:", error);
      toast.error("Failed to load file history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const deleteFile = async (id: string, filePath: string) => {
    if (!user) return;

    try {
      // Delete from storage
      if (filePath) {
        await supabase.storage.from("user-files").remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from("file_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    if (!user || !filePath) return;

    try {
      const { data, error } = await supabase.storage
        .from("user-files")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return {
    files,
    loading,
    deleteFile,
    downloadFile,
    refetch: fetchFiles,
  };
};
