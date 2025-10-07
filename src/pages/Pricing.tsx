import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    priceId: null,
    description: "Perfect for getting started",
    features: [
      "Connect 1 social media account",
      "Basic performance analytics",
      "7-day content suggestions",
      "Limited AI insights",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    priceId: "price_1SFVOOHTchnCHOI3Yi99rrjj",
    description: "Best for serious creators",
    features: [
      "Connect unlimited accounts",
      "Advanced analytics & trends",
      "30-day content calendar",
      "Unlimited AI insights",
      "Priority support",
      "Export PDF reports",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceId: null,
    description: "For agencies and teams",
    features: [
      "Everything in Pro",
      "Multi-user access",
      "White-label reports",
      "Custom integrations",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, tierName: string) => {
    if (!priceId) {
      if (tierName === "Free") {
        navigate("/auth");
      } else {
        toast({
          title: "Contact Us",
          description: "Please reach out to discuss enterprise pricing.",
        });
      }
      return;
    }

    setLoadingTier(tierName);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. All plans include 7-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={`glass-card p-8 relative animate-slide-up ${
                tier.popular ? "border-primary scale-105 glow-primary" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold gradient-text">
                    {tier.price}
                  </span>
                  {tier.priceId && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(tier.priceId, tier.name)}
                  disabled={loadingTier === tier.name}
                  className={`w-full ${
                    tier.popular
                      ? "bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 glow-primary"
                      : ""
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {loadingTier === tier.name ? "Processing..." : tier.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center space-y-4 pt-12">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="glass-card p-6 text-left">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time. No questions asked.
              </p>
            </Card>
            <Card className="glass-card p-6 text-left">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards through Stripe's secure payment processing.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
