import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  Download,
  Trash2,
  History,
  Workflow,
  Settings,
  User,
  Loader2,
  FileX,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFileHistory } from "@/hooks/useFileHistory";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const savedWorkflows = [
  { name: "Image → PDF → Compress", steps: 3 },
  { name: "Merge → Secure → Download", steps: 3 },
];

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { files, loading: filesLoading, deleteFile, downloadFile } = useFileHistory();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <Layout>
      <section className="py-20 bg-gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
            <p className="text-muted-foreground">Here's your recent activity</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Files */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Recent Files
                  </h2>
                </div>

                {filesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileX className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-2">No files processed yet</p>
                    <Link to="/pdf-tools">
                      <Button variant="outline" size="sm">
                        Start using tools
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.original_file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.tool_used} • {formatFileSize(file.file_size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                        </div>
                        <div className="flex gap-1">
                          {file.processed_file_path && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                downloadFile(
                                  file.processed_file_path!,
                                  file.processed_file_name || file.original_file_name
                                )
                              }
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteFile(file.id, file.processed_file_path || file.original_file_path)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Saved Workflows */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-primary" />
                    Saved Workflows
                  </h2>
                  <Link to="/workflow">
                    <Button variant="ghost" size="sm">
                      Create New
                    </Button>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {savedWorkflows.map((workflow, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                    >
                      <p className="font-medium mb-1">{workflow.name}</p>
                      <p className="text-sm text-muted-foreground">{workflow.steps} steps</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-semibold mb-4">Your Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Files processed</span>
                    <span className="font-bold text-xl">{files.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total saved</span>
                    <span className="font-bold text-xl gradient-text">
                      {formatFileSize(files.reduce((acc, f) => acc + (f.file_size || 0), 0))}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Account */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
