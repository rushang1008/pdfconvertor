import { motion } from "framer-motion";
import { SmartInput } from "./SmartInput";
import { FileText, Zap, Shield } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-20 h-20 rounded-2xl gradient-primary opacity-20 blur-xl"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-[15%] w-32 h-32 rounded-full bg-secondary opacity-20 blur-2xl"
      />
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-[20%] w-16 h-16 rounded-xl bg-primary opacity-10 blur-lg"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Free PDF tools, no signup required</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            All Your PDF & Document{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Tools in One Place</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Merge, split, convert, compress, and edit PDFs with ease. 
            Build custom workflows and let AI assist you—all for free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SmartInput />
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>20+ PDF tools</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Files auto-delete in 30 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Lightning fast</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
