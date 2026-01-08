import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  GripVertical,
  X,
  Play,
  Save,
  Image,
  FileText,
  Lock,
  Shrink,
  Combine,
  Scissors,
  FileOutput,
} from "lucide-react";

const availableSteps = [
  { id: "image-to-pdf", label: "Image to PDF", icon: Image, color: "bg-tool-convert/10 text-tool-convert" },
  { id: "merge", label: "Merge PDF", icon: Combine, color: "bg-tool-pdf/10 text-tool-pdf" },
  { id: "split", label: "Split PDF", icon: Scissors, color: "bg-tool-pdf/10 text-tool-pdf" },
  { id: "compress", label: "Compress", icon: Shrink, color: "bg-tool-pdf/10 text-tool-pdf" },
  { id: "secure", label: "Add Password", icon: Lock, color: "bg-tool-secure/10 text-tool-secure" },
  { id: "convert", label: "Convert to Word", icon: FileOutput, color: "bg-tool-convert/10 text-tool-convert" },
];

interface WorkflowStep {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const Workflow = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    availableSteps[0],
    availableSteps[3],
    availableSteps[4],
  ]);

  const addStep = (step: typeof availableSteps[0]) => {
    setSteps([...steps, { ...step }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <section className="py-20 bg-gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Workflow Builder</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Create multi-step workflows to automate your document processing
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Current Workflow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 mb-8"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Your Workflow
              </h3>

              {steps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Add steps from the panel below to build your workflow</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={`${step.id}-${index}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-muted/50 rounded-xl p-4"
                    >
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                      <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium flex-1">{step.label}</span>
                      <button
                        onClick={() => removeStep(index)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                      >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {steps.length > 0 && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button className="gradient-primary border-0 flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </Button>
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Available Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="font-semibold mb-4">Add Steps</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSteps.map((step) => (
                  <motion.button
                    key={step.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addStep(step)}
                    className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                    <Plus className="w-4 h-4 text-muted-foreground ml-auto" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Workflow;
