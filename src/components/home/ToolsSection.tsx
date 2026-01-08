import { motion } from "framer-motion";
import {
  FileText,
  FilePlus,
  Scissors,
  Combine,
  Shrink,
  Lock,
  Unlock,
  Droplet,
  RotateCw,
  FileOutput,
  FileInput,
  Image,
  FileSpreadsheet,
  Presentation,
  Sparkles,
  Wand2,
} from "lucide-react";
import { ToolCard } from "./ToolCard";

const pdfTools = [
  { title: "Create PDF", description: "Create PDF from text, images, or scratch", icon: FilePlus, href: "/pdf-tools?tool=create", color: "pdf" as const },
  { title: "Merge PDF", description: "Combine multiple PDFs into one", icon: Combine, href: "/pdf-tools?tool=merge", color: "pdf" as const },
  { title: "Split PDF", description: "Extract pages or split into parts", icon: Scissors, href: "/pdf-tools?tool=split", color: "pdf" as const },
  { title: "Compress PDF", description: "Reduce file size while keeping quality", icon: Shrink, href: "/pdf-tools?tool=compress", color: "pdf" as const },
  { title: "Edit PDF", description: "Modify text, reorder pages", icon: FileText, href: "/pdf-tools?tool=edit", color: "pdf" as const },
  { title: "Rotate Pages", description: "Rotate PDF pages to any angle", icon: RotateCw, href: "/pdf-tools?tool=rotate", color: "pdf" as const },
];

const securityTools = [
  { title: "Secure PDF", description: "Add password protection", icon: Lock, href: "/pdf-tools?tool=secure", color: "secure" as const },
  { title: "Unlock PDF", description: "Remove password from PDF", icon: Unlock, href: "/pdf-tools?tool=unlock", color: "secure" as const },
  { title: "Add Watermark", description: "Add text or image watermarks", icon: Droplet, href: "/pdf-tools?tool=watermark", color: "secure" as const },
];

const convertTools = [
  { title: "PDF to Word", description: "Convert PDF to editable DOCX", icon: FileOutput, href: "/convert?tool=pdf-to-word", color: "convert" as const },
  { title: "Word to PDF", description: "Convert DOCX to PDF format", icon: FileInput, href: "/convert?tool=word-to-pdf", color: "convert" as const },
  { title: "PDF to Image", description: "Export PDF pages as JPG/PNG", icon: Image, href: "/convert?tool=pdf-to-image", color: "convert" as const },
  { title: "Image to PDF", description: "Convert images to PDF document", icon: FilePlus, href: "/convert?tool=image-to-pdf", color: "convert" as const },
  { title: "PDF to Excel", description: "Extract tables to spreadsheet", icon: FileSpreadsheet, href: "/convert?tool=pdf-to-excel", color: "convert" as const },
  { title: "PDF to PPT", description: "Convert PDF to presentation", icon: Presentation, href: "/convert?tool=pdf-to-ppt", color: "convert" as const },
];

const aiTools = [
  { title: "OCR Scanner", description: "Extract text from scanned PDFs", icon: Sparkles, href: "/pdf-tools?tool=ocr", color: "ai" as const, isPro: true },
  { title: "Smart Detect", description: "Auto-detect document type", icon: Wand2, href: "/pdf-tools?tool=detect", color: "ai" as const, isPro: true },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ToolsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* PDF Tools */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">PDF Tools</h2>
            <p className="text-muted-foreground">Everything you need to work with PDFs</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {pdfTools.map((tool) => (
              <motion.div key={tool.title} variants={itemVariants}>
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Security Tools */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">Security & Protection</h2>
            <p className="text-muted-foreground">Keep your documents safe and secure</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {securityTools.map((tool) => (
              <motion.div key={tool.title} variants={itemVariants}>
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Convert Tools */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">Convert Documents</h2>
            <p className="text-muted-foreground">Transform between PDF and other formats</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {convertTools.map((tool) => (
              <motion.div key={tool.title} variants={itemVariants}>
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* AI Tools */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">
              <span className="gradient-text">AI-Powered</span> Tools
            </h2>
            <p className="text-muted-foreground">Smart features for advanced workflows</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {aiTools.map((tool) => (
              <motion.div key={tool.title} variants={itemVariants}>
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
