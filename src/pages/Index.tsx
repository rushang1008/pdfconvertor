import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { WorkflowPreview } from "@/components/home/WorkflowPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ToolsSection />
      <WorkflowPreview />
    </Layout>
  );
};

export default Index;
