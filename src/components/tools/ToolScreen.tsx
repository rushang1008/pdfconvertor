import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToolConfig } from "@/lib/toolConfig";
import { FileUpload } from "./FileUpload";
import { ToolOptions } from "./ToolOptions";
import { ProcessingState } from "./ProcessingState";
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  preview?: string;
  storagePath?: string;
  publicUrl?: string;
}

interface ToolScreenProps {
  config: ToolConfig;
  backLink: string;
  backLabel: string;
}

type ScreenState = "upload" | "uploading" | "processing" | "complete" | "error";

const colorClasses = {
  pdf: "bg-tool-pdf/10 text-tool-pdf",
  convert: "bg-tool-convert/10 text-tool-convert",
  secure: "bg-tool-secure/10 text-tool-secure",
  ai: "bg-tool-ai/10 text-tool-ai",
};

// Tools that are implemented with real processing
const implementedTools = ['merge', 'split', 'rotate', 'secure', 'watermark', 'image-to-pdf', 'compress'];

export const ToolScreen = ({ config, backLink, backLabel }: ToolScreenProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [optionValues, setOptionValues] = useState<Record<string, string | number | boolean>>({});
  const [screenState, setScreenState] = useState<ScreenState>("upload");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { uploading, processing, progress, uploadFiles, processFiles, reset } = useFileProcessing();

  const Icon = config.icon;
  const isImplemented = implementedTools.includes(config.id);

  // Update screen state based on processing state
  useEffect(() => {
    if (uploading) {
      setScreenState("uploading");
    } else if (processing) {
      setScreenState("processing");
    }
  }, [uploading, processing]);

  const handleOptionChange = useCallback((id: string, value: string | number | boolean) => {
    setOptionValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleProcess = useCallback(async () => {
    if (!isImplemented) {
      // Simulate processing for non-implemented tools
      setScreenState("processing");
      
      const interval = setInterval(() => {
        setScreenState((prev) => {
          if (prev === "processing") {
            setTimeout(() => setScreenState("complete"), 2000);
          }
          return prev;
        });
      }, 2000);
      
      setTimeout(() => {
        clearInterval(interval);
        setScreenState("complete");
        toast.info("This tool is in demo mode. Full processing coming soon!");
      }, 3000);
      return;
    }

    try {
      setErrorMessage(null);
      
      // Validate password fields for secure tool
      if (config.id === 'secure') {
        const password = optionValues.password as string;
        const confirmPassword = optionValues.confirmPassword as string;
        
        if (!password) {
          toast.error("Please enter a password");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
      }

      // Validate watermark text
      if (config.id === 'watermark' && !optionValues.watermarkText) {
        toast.error("Please enter watermark text");
        return;
      }

      // Upload files first
      const uploadedFiles = await uploadFiles(files.map(f => f.file));
      
      if (uploadedFiles.length === 0) {
        throw new Error("No files were uploaded");
      }

      // Get file URLs for processing
      const fileUrls = uploadedFiles
        .map(f => f.publicUrl)
        .filter((url): url is string => !!url);

      if (fileUrls.length === 0) {
        throw new Error("Failed to get file URLs");
      }

      // Process files
      const result = await processFiles(
        config.id,
        fileUrls,
        optionValues,
        files[0]?.file.name || 'document'
      );

      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        setScreenState("complete");
        toast.success("File processed successfully!");
      } else {
        setErrorMessage(result.error || "Processing failed");
        setScreenState("error");
      }
    } catch (error: any) {
      console.error("Processing error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      setScreenState("error");
    }
  }, [config.id, files, optionValues, uploadFiles, processFiles, isImplemented]);

  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `processed-${files[0]?.file.name || 'document.pdf'}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (!isImplemented) {
      toast.info("Demo mode - no actual file generated");
    }
  }, [downloadUrl, files, isImplemented]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setOptionValues({});
    setScreenState("upload");
    setDownloadUrl(null);
    setErrorMessage(null);
    reset();
    navigate(backLink);
  }, [navigate, backLink, reset]);

  const isReady = files.length > 0;

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </motion.div>

        {/* Tool Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl ${colorClasses[config.color]} flex items-center justify-center`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{config.title}</h1>
            {config.isPro && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-primary rounded-full text-xs text-primary-foreground font-medium">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            {config.longDescription}
          </p>

          {!isImplemented && (
            <p className="text-xs text-amber-500 mt-2">
              ⚠️ Demo mode - full processing coming soon
            </p>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-tool overflow-hidden"
        >
          {screenState === "upload" ? (
            <div className="p-6 space-y-6">
              {/* File Upload */}
              <FileUpload
                acceptedTypes={config.acceptedTypes}
                acceptedTypesLabel={config.acceptedTypesLabel}
                multiple={config.multiple}
                files={files}
                onFilesChange={setFiles}
              />

              {/* Options */}
              {isReady && config.options.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <ToolOptions
                    options={config.options}
                    values={optionValues}
                    onChange={handleOptionChange}
                  />
                </motion.div>
              )}

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="lg"
                  disabled={!isReady}
                  onClick={handleProcess}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed h-14 text-lg"
                >
                  {config.actionLabel}
                </Button>
              </motion.div>

              {/* Login prompt for guests */}
              {!user && (
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to save your file history
                </p>
              )}
            </div>
          ) : (
            <ProcessingState
              status={
                screenState === "uploading" || screenState === "processing" 
                  ? "processing" 
                  : screenState === "complete" 
                    ? "complete" 
                    : "error"
              }
              progress={Math.min(progress, 100)}
              onDownload={handleDownload}
              onReset={handleReset}
              errorMessage={errorMessage}
            />
          )}
        </motion.div>

        {/* Privacy Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          🔒 {user ? "Your files are saved to your account" : "Your files are automatically deleted after 30 minutes"}
        </motion.p>
      </div>
    </div>
  );
};
