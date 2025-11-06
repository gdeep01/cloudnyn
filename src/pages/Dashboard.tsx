import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart3, Brain, CalendarDays } from "lucide-react";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { PrescriptivePanel } from "@/components/dashboard/PrescriptivePanel";
import { SubscriptionStatus } from "@/components/dashboard/SubscriptionStatus";
import { SocialMediaSearch } from "@/components/dashboard/SocialMediaSearch";
import { useState } from "react";

const Dashboard = () => {
  const [youtubeData, setYoutubeData] = useState<any>(null);
  const [instagramData, setInstagramData] = useState<any>(null);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Subscription Status */}
        <SubscriptionStatus />

        {/* Social Media Search */}
        <SocialMediaSearch 
          onYouTubeData={(channelId, data) => {
            console.log("YouTube data:", channelId, data);
            setYoutubeData(data);
          }}
          onInstagramData={(username, data) => {
            console.log("Instagram data:", username, data);
            setInstagramData(data);
          }}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Content Strategy Dashboard
            </h1>
            <p className="text-muted-foreground">
              AI-powered insights for your social media growth
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 glow-primary">
            <FileDown className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Past Performance Section */}
        <section className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Past Performance</h2>
          </div>
          <Card className="glass-card p-6">
            <PerformanceChart />
          </Card>
        </section>

        {/* Current Trends Section */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-semibold">Current Trends</h2>
          </div>
          <Card className="glass-card p-6">
            <TrendsChart />
          </Card>
        </section>

        {/* Prescriptive Section */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-400" />
            <h2 className="text-2xl font-semibold">Your Next 7 Days</h2>
          </div>
          <Card className="glass-card p-6">
            <PrescriptivePanel />
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
