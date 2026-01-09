import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/home/ToolCard";
import { ToolScreen } from "@/components/tools/ToolScreen";
import { getToolConfig } from "@/lib/toolConfig";
import {
  FileOutput,
  FileInput,
  Image,
  FilePlus,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";

const tools = [
  { title: "PDF to Word", description: "Convert PDF to editable DOCX", icon: FileOutput, href: "/convert?tool=pdf-to-word", color: "convert" as const },
  { title: "Word to PDF", description: "Convert DOCX to PDF format", icon: FileInput, href: "/convert?tool=word-to-pdf", color: "convert" as const },
  { title: "PDF to Image", description: "Export PDF pages as JPG/PNG", icon: Image, href: "/convert?tool=pdf-to-image", color: "convert" as const },
  { title: "Image to PDF", description: "Convert images to PDF document", icon: FilePlus, href: "/convert?tool=image-to-pdf", color: "convert" as const },
  { title: "PDF to Excel", description: "Extract tables to spreadsheet", icon: FileSpreadsheet, href: "/convert?tool=pdf-to-excel", color: "convert" as const },
  { title: "PDF to PPT", description: "Convert PDF to presentation", icon: Presentation, href: "/convert?tool=pdf-to-ppt", color: "convert" as const },
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

const Convert = () => {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get("tool");
  const toolConfig = toolId ? getToolConfig(toolId) : null;

  // Show tool screen if a tool is selected
  if (toolConfig) {
    return (
      <Layout>
        <ToolScreen
          config={toolConfig}
          backLink="/convert"
          backLabel="Back to Convert Tools"
        />
      </Layout>
    );
  }

  // Show tool grid
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Convert Documents</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Transform between PDF and other popular formats with ease
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
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

export default Convert;
