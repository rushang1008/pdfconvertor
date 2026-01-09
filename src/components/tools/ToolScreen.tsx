import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToolConfig } from "@/lib/toolConfig";
import { FileUpload } from "./FileUpload";
import { ToolOptions } from "./ToolOptions";
import { ProcessingState } from "./ProcessingState";

interface UploadedFile {
  file: File;
  preview?: string;
}

interface ToolScreenProps {
  config: ToolConfig;
  backLink: string;
  backLabel: string;
}

type ScreenState = "upload" | "processing" | "complete" | "error";

const colorClasses = {
  pdf: "bg-tool-pdf/10 text-tool-pdf",
  convert: "bg-tool-convert/10 text-tool-convert",
  secure: "bg-tool-secure/10 text-tool-secure",
  ai: "bg-tool-ai/10 text-tool-ai",
};

export const ToolScreen = ({ config, backLink, backLabel }: ToolScreenProps) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [optionValues, setOptionValues] = useState<Record<string, string | number | boolean>>({});
  const [screenState, setScreenState] = useState<ScreenState>("upload");
  const [progress, setProgress] = useState(0);

  const Icon = config.icon;

  const handleOptionChange = useCallback((id: string, value: string | number | boolean) => {
    setOptionValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleProcess = useCallback(() => {
    setScreenState("processing");
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScreenState("complete");
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  }, []);

  const handleDownload = useCallback(() => {
    // Simulate download
    const link = document.createElement("a");
    link.href = "#";
    link.download = "processed-file.pdf";
    // In real implementation, this would trigger actual download
    console.log("Downloading file...");
  }, []);

  const handleReset = useCallback(() => {
    setFiles([]);
    setOptionValues({});
    setScreenState("upload");
    setProgress(0);
    navigate(backLink);
  }, [navigate, backLink]);

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
            </div>
          ) : (
            <ProcessingState
              status={screenState === "processing" ? "processing" : screenState === "complete" ? "complete" : "error"}
              progress={Math.min(progress, 100)}
              onDownload={handleDownload}
              onReset={handleReset}
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
          🔒 Your files are automatically deleted after 30 minutes
        </motion.p>
      </div>
    </div>
  );
};
