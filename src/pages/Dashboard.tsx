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
} from "lucide-react";
import { Link } from "react-router-dom";

const recentFiles = [
  { name: "Report_2024.pdf", action: "Merged", time: "2 hours ago", size: "2.4 MB" },
  { name: "Contract_Draft.pdf", action: "Compressed", time: "5 hours ago", size: "856 KB" },
  { name: "Presentation.pdf", action: "Converted from PPT", time: "1 day ago", size: "4.1 MB" },
  { name: "Invoice_Jan.pdf", action: "Password protected", time: "2 days ago", size: "124 KB" },
];

const savedWorkflows = [
  { name: "Image → PDF → Compress", steps: 3 },
  { name: "Merge → Secure → Download", steps: 3 },
];

const Dashboard = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
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
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {recentFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.action} • {file.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {file.time}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                <h2 className="font-semibold mb-4">This Month</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Files processed</span>
                    <span className="font-bold text-xl">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Storage saved</span>
                    <span className="font-bold text-xl gradient-text">128 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Workflows run</span>
                    <span className="font-bold text-xl">12</span>
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
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Pro Plan</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
