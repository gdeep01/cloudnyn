import { Button } from "@/components/ui/button";
import { Clock, Sparkles, Film } from "lucide-react";
import { useState } from "react";
import cloudnynLogo from "@/assets/cloudnyn-logo.png";

const actionPlan = [
  {
    day: "Monday",
    time: "6:00 PM",
    type: "Reel",
    topic: "Behind-the-scenes content",
    hashtags: "#BehindTheScenes #CreatorLife #ContentCreation",
    icon: Film,
  },
  {
    day: "Tuesday",
    time: "2:00 PM",
    type: "Carousel",
    topic: "Tips & tricks in your niche",
    hashtags: "#ProTips #Tutorial #Learning",
    icon: Sparkles,
  },
  {
    day: "Thursday",
    time: "7:00 PM",
    type: "Reel",
    topic: "Trending challenge or meme",
    hashtags: "#Trending #Viral #Challenge",
    icon: Film,
  },
  {
    day: "Saturday",
    time: "11:00 AM",
    type: "Post",
    topic: "Community engagement question",
    hashtags: "#Community #Engagement #AskMeAnything",
    icon: () => <img src={cloudnynLogo} alt="CloudNyn" className="h-5 w-auto" />,
  },
];

export const PrescriptivePanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI-Powered Action Plan</h3>
          <p className="text-sm text-muted-foreground">
            Optimized schedule based on your audience patterns
          </p>
        </div>
        <Button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90"
        >
          <img src={cloudnynLogo} alt="CloudNyn" className={`mr-2 h-4 w-auto ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Analyzing..." : "Refresh Insights"}
        </Button>
      </div>

      <div className="grid gap-4">
        {actionPlan.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-secondary/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{item.day}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="text-accent font-medium">{item.type}:</span>{" "}
                    {item.topic}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.hashtags.split(" ").map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-muted px-2 py-1 rounded-full text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <img src={cloudnynLogo} alt="CloudNyn" className="h-5 w-auto mt-0.5" />
          <div>
            <p className="font-medium text-accent mb-1">AI Insight</p>
            <p className="text-sm text-muted-foreground">
              Your engagement peaks on Thursday and Saturday evenings. Focus your best
              content around these times for maximum impact. Reels are performing 18%
              better than other formats this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
