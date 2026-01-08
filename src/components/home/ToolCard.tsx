import { motion } from "framer-motion";
import { LucideIcon, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: "pdf" | "convert" | "secure" | "ai";
  isPro?: boolean;
}

const colorClasses = {
  pdf: "bg-tool-pdf/10 text-tool-pdf",
  convert: "bg-tool-convert/10 text-tool-convert",
  secure: "bg-tool-secure/10 text-tool-secure",
  ai: "bg-tool-ai/10 text-tool-ai",
};

const borderClasses = {
  pdf: "hover:border-tool-pdf/50",
  convert: "hover:border-tool-convert/50",
  secure: "hover:border-tool-secure/50",
  ai: "hover:border-tool-ai/50",
};

export const ToolCard = ({ title, description, icon: Icon, href, color, isPro }: ToolCardProps) => {
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative bg-card border border-border rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-tool hover:shadow-tool-hover ${borderClasses[color]}`}
      >
        {isPro && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-primary rounded-full text-xs text-primary-foreground font-medium">
            <Crown className="w-3 h-3" />
            Pro
          </div>
        )}
        
        <div className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
          <Icon className="w-7 h-7" />
        </div>
        
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>
    </Link>
  );
};
