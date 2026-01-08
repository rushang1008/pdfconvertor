import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, FileText, Combine, Split, Lock, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const suggestions = [
  { icon: Combine, text: "Merge PDFs", action: "/pdf-tools?tool=merge" },
  { icon: Split, text: "Split PDF", action: "/pdf-tools?tool=split" },
  { icon: Lock, text: "Protect PDF", action: "/pdf-tools?tool=secure" },
  { icon: Image, text: "Convert to Image", action: "/convert?tool=pdf-to-image" },
];

export const SmartInput = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Simple intent detection
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes("merge") || lowerQuery.includes("combine")) {
        navigate("/pdf-tools?tool=merge");
      } else if (lowerQuery.includes("split") || lowerQuery.includes("separate")) {
        navigate("/pdf-tools?tool=split");
      } else if (lowerQuery.includes("convert") || lowerQuery.includes("word")) {
        navigate("/convert");
      } else if (lowerQuery.includes("protect") || lowerQuery.includes("password") || lowerQuery.includes("secure")) {
        navigate("/pdf-tools?tool=secure");
      } else if (lowerQuery.includes("compress") || lowerQuery.includes("smaller")) {
        navigate("/pdf-tools?tool=compress");
      } else {
        navigate("/pdf-tools");
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{ scale: focused ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`relative rounded-2xl transition-shadow duration-300 ${
            focused ? "shadow-glow" : "shadow-tool"
          }`}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="What do you want to do? Try 'merge PDFs' or 'convert to Word'"
            className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-32 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 gradient-primary border-0 rounded-xl"
          >
            <span className="hidden sm:inline mr-2">Find Tool</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="text-sm text-muted-foreground">Quick:</span>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(suggestion.action)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-sm text-foreground hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <suggestion.icon className="w-3.5 h-3.5 text-primary" />
            {suggestion.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
