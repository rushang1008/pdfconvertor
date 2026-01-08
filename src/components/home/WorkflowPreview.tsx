import { motion } from "framer-motion";
import { ArrowRight, Image, FileText, Lock, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  { icon: Image, label: "Image", color: "bg-tool-convert/10 text-tool-convert" },
  { icon: FileText, label: "PDF", color: "bg-tool-pdf/10 text-tool-pdf" },
  { icon: Lock, label: "Secure", color: "bg-tool-secure/10 text-tool-secure" },
  { icon: Download, label: "Download", color: "bg-primary/10 text-primary" },
];

export const WorkflowPreview = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Build Custom Workflows</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Chain multiple operations together. Convert an image to PDF, add security, 
              and download—all in one seamless flow.
            </p>
          </motion.div>

          {/* Workflow visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-muted/50 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 md:gap-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${step.color} flex items-center justify-center`}>
                      <step.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/50 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link to="/workflow">
              <Button size="lg" className="gradient-primary border-0">
                Create Your Workflow
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
