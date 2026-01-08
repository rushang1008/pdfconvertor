import { Link } from "react-router-dom";
import { FileText, Shield, Clock, Lock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Privacy Banner */}
        <div className="bg-gradient-hero rounded-2xl p-6 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-foreground">Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-foreground">Files auto-delete in 30 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-foreground">Secure SSL encryption</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold gradient-text">MrPDF</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your all-in-one PDF & document toolkit. Simple, fast, and secure.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">PDF Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pdf-tools" className="hover:text-foreground transition-colors">Merge PDF</Link></li>
              <li><Link to="/pdf-tools" className="hover:text-foreground transition-colors">Split PDF</Link></li>
              <li><Link to="/pdf-tools" className="hover:text-foreground transition-colors">Compress PDF</Link></li>
              <li><Link to="/pdf-tools" className="hover:text-foreground transition-colors">Edit PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Convert</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/convert" className="hover:text-foreground transition-colors">PDF to Word</Link></li>
              <li><Link to="/convert" className="hover:text-foreground transition-colors">Word to PDF</Link></li>
              <li><Link to="/convert" className="hover:text-foreground transition-colors">PDF to Image</Link></li>
              <li><Link to="/convert" className="hover:text-foreground transition-colors">Image to PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MrPDF. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
