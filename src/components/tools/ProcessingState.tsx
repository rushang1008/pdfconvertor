import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProcessingStateProps {
  status: "processing" | "complete" | "error";
  progress: number;
  onDownload: () => void;
  onReset: () => void;
  errorMessage?: string;
}

export const ProcessingState = ({
  status,
  progress,
  onDownload,
  onReset,
  errorMessage,
}: ProcessingStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      {status === "processing" && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
          >
            <Loader2 className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Processing your file...
          </h3>
          <p className="text-muted-foreground mb-6">
            This may take a few moments
          </p>
          
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center mt-2">
              {progress}% complete
            </p>
          </div>
        </>
      )}

      {status === "complete" && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </motion.div>
          
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            Success!
          </h3>
          <p className="text-muted-foreground mb-8">
            Your file has been processed successfully
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={onDownload}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              <Download className="w-5 h-5 mr-2" />
              Download File
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onReset}
            >
              Use Another Tool
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6"
          >
            <span className="text-4xl">⚠️</span>
          </motion.div>
          
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            {errorMessage || "There was an error processing your file. Please try again."}
          </p>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
          >
            Try Again
          </Button>
        </>
      )}
    </motion.div>
  );
};
