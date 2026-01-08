import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Building } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for occasional use",
    features: [
      "All basic PDF tools",
      "Up to 10MB file size",
      "5 operations per day",
      "Files auto-delete in 30 min",
      "Basic convert tools",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$9",
    period: "/month",
    description: "For power users and professionals",
    features: [
      "Everything in Free",
      "Up to 100MB file size",
      "Unlimited operations",
      "OCR for scanned PDFs",
      "Save & reuse workflows",
      "File history (30 days)",
      "Priority processing",
      "No watermarks",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    icon: Building,
    price: "$29",
    period: "/month",
    description: "For teams and enterprises",
    features: [
      "Everything in Pro",
      "Up to 500MB file size",
      "Team collaboration",
      "API access",
      "Custom branding",
      "Dedicated support",
      "SSO integration",
      "Audit logs",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card border rounded-2xl p-8 ${
                  plan.popular
                    ? "border-primary shadow-glow"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-primary rounded-full text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular ? "gradient-primary" : "bg-muted"
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth?mode=signup">
                  <Button
                    className={`w-full ${plan.popular ? "gradient-primary border-0" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
