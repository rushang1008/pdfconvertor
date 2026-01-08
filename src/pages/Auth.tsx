import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth will be implemented with Supabase
    console.log("Auth submitted:", { email, password, name, isSignup });
  };

  return (
    <Layout>
      <section className="py-20 min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-tool">
              {/* Logo */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </div>
                </Link>
                <h1 className="text-2xl font-bold mb-2">
                  {isSignup ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-muted-foreground">
                  {isSignup
                    ? "Start using MrPDF for free"
                    : "Sign in to access your tools"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-primary border-0">
                  {isSignup ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isSignup ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
