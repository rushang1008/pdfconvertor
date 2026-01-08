import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "PDF Tools", path: "/pdf-tools" },
  { label: "Convert", path: "/convert" },
  { label: "Workflow", path: "/workflow" },
  { label: "Pricing", path: "/pricing" },
];

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"
            >
              <FileText className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">MrPDF</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-muted rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="gradient-primary border-0">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-border"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-muted text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border mt-2">
              <Link to="/auth" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup" className="flex-1">
                <Button size="sm" className="w-full gradient-primary border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};
