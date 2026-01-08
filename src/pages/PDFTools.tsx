import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/home/ToolCard";
import {
  FilePlus,
  Combine,
  Scissors,
  Shrink,
  FileText,
  RotateCw,
  Lock,
  Unlock,
  Droplet,
  Sparkles,
  Wand2,
} from "lucide-react";

const tools = [
  { title: "Create PDF", description: "Create PDF from text, images, or scratch", icon: FilePlus, href: "/pdf-tools?tool=create", color: "pdf" as const },
  { title: "Edit PDF", description: "Modify text, reorder pages", icon: FileText, href: "/pdf-tools?tool=edit", color: "pdf" as const },
  { title: "Merge PDF", description: "Combine multiple PDFs into one", icon: Combine, href: "/pdf-tools?tool=merge", color: "pdf" as const },
  { title: "Split PDF", description: "Extract pages or split into parts", icon: Scissors, href: "/pdf-tools?tool=split", color: "pdf" as const },
  { title: "Compress PDF", description: "Reduce file size while keeping quality", icon: Shrink, href: "/pdf-tools?tool=compress", color: "pdf" as const },
  { title: "Rotate Pages", description: "Rotate PDF pages to any angle", icon: RotateCw, href: "/pdf-tools?tool=rotate", color: "pdf" as const },
  { title: "Secure PDF", description: "Add password protection", icon: Lock, href: "/pdf-tools?tool=secure", color: "secure" as const },
  { title: "Unlock PDF", description: "Remove password from PDF", icon: Unlock, href: "/pdf-tools?tool=unlock", color: "secure" as const },
  { title: "Add Watermark", description: "Add text or image watermarks", icon: Droplet, href: "/pdf-tools?tool=watermark", color: "secure" as const },
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

const PDFTools = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">PDF Tools</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to create, edit, and manage your PDF documents
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {tools.map((tool) => (
              <motion.div key={tool.title} variants={itemVariants}>
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PDFTools;
