import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Crown, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionData {
  subscribed: boolean;
  product_id?: string;
  subscription_end?: string;
}

export const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSubscription({ subscribed: false });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) throw error;

      setSubscription(data);
    } catch (error: any) {
      console.error("Subscription check error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return null;
  }

  if (!subscription?.subscribed) {
    return (
      <Card className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-lg">
              <Crown className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Free Plan</p>
              <p className="text-sm text-muted-foreground">Limited features</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/pricing")}
            className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90"
          >
            Upgrade to Pro
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-4 mb-6 border-primary/50 glow-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold flex items-center gap-2">
              Pro Plan
              <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">Active</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {subscription.subscription_end &&
                `Renews ${new Date(subscription.subscription_end).toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <Button
          onClick={handleManageSubscription}
          variant="outline"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>
    </Card>
  );
};
