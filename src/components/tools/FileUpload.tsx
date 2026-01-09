import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview?: string;
}

interface FileUploadProps {
  acceptedTypes: string[];
  acceptedTypesLabel: string;
  multiple?: boolean;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type === "application/pdf") return FileText;
  return File;
};

export const FileUpload = ({
  acceptedTypes,
  acceptedTypesLabel,
  multiple = false,
  files,
  onFilesChange,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [multiple, files]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
      }
    },
    [multiple, files]
  );

  const processFiles = (newFiles: File[]) => {
    const processedFiles: UploadedFile[] = newFiles.map((file) => {
      const uploadedFile: UploadedFile = { file };
      
      // Create preview for images
      if (file.type.startsWith("image/")) {
        uploadedFile.preview = URL.createObjectURL(file);
      }
      
      return uploadedFile;
    });

    if (multiple) {
      onFilesChange([...files, ...processedFiles]);
    } else {
      // Revoke old preview URLs
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      onFilesChange(processedFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!);
    }
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          accept={acceptedTypes.join(",")}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
              isDragging ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}
          >
            <Upload className="w-8 h-8" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isDragging ? "Drop your files here" : "Drag & drop files here"}
          </h3>
          <p className="text-muted-foreground mb-4">
            or click to browse from your computer
          </p>
          <div className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            Accepted formats: {acceptedTypesLabel}
          </div>
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence mode="popLayout">
        {files.map((uploadedFile, index) => {
          const FileIcon = getFileIcon(uploadedFile.file.type);
          const isImage = uploadedFile.file.type.startsWith("image/");
          const isPDF = uploadedFile.file.type === "application/pdf";

          return (
            <motion.div
              key={`${uploadedFile.file.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
            >
              {/* Preview */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                {isImage && uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : isPDF ? (
                  <FileText className="w-8 h-8 text-tool-pdf" />
                ) : (
                  <FileIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
              </div>

              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFile(index)}
                className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
