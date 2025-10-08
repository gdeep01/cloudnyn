import { Button } from "@/components/ui/button";
import { Instagram, Youtube, TrendingUp, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cloudnynLogo from "@/assets/cloudnyn-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
            <img src={cloudnynLogo} alt="CloudNyn" className="h-4 w-auto" />
            <span>AI-Powered Social Media Strategy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Know exactly what to{" "}
            <span className="gradient-text">post next</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI analyzes your account performance and tells you exactly what content
            to create, when to post it, and which hashtags to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 glow-primary"
            >
              <img src={cloudnynLogo} alt="CloudNyn" className="mr-2 h-5 w-auto" />
              Get Started Free
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/dashboard")}
              variant="outline"
            >
              View Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • 7-day free trial
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 space-y-4 animate-slide-up hover:scale-105 transition-transform">
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Past Performance</h3>
              <p className="text-muted-foreground">
                Deep dive into your engagement, reach, and top-performing content
                with beautiful visualizations.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4 animate-slide-up hover:scale-105 transition-transform" style={{ animationDelay: "0.1s" }}>
              <div className="bg-accent/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Current Trends</h3>
              <p className="text-muted-foreground">
                Discover patterns in audience activity, retention rates, and content
                type performance.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4 animate-slide-up hover:scale-105 transition-transform" style={{ animationDelay: "0.2s" }}>
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">AI Action Plan</h3>
              <p className="text-muted-foreground">
                Get a complete 7-day content calendar with topics, hashtags, and
                optimal posting times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 glass-card p-12 rounded-2xl animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to grow your audience?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of creators who use AI-powered insights to create better content.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/pricing")}
            className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 glow-primary"
          >
            <img src={cloudnynLogo} alt="CloudNyn" className="mr-2 h-5 w-auto" />
            View Pricing
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
