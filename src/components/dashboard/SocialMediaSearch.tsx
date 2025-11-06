import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Youtube, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { youtubeAPI } from "@/integrations/youtube/client";

interface SocialMediaSearchProps {
  onYouTubeData?: (channelId: string, data: any) => void;
  onInstagramData?: (username: string, data: any) => void;
}

export const SocialMediaSearch = ({ onYouTubeData, onInstagramData }: SocialMediaSearchProps) => {
  const [youtubeInput, setYoutubeInput] = useState("");
  const [instagramInput, setInstagramInput] = useState("");
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [loadingInstagram, setLoadingInstagram] = useState(false);
  const { toast } = useToast();

  const extractYouTubeIdentifier = (input: string): string => {
    // Handle YouTube URLs
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      const url = new URL(input.startsWith('http') ? input : `https://${input}`);
      // Channel URL
      if (url.pathname.includes('/channel/')) {
        return url.pathname.split('/channel/')[1].split('/')[0];
      }
      // User URL (@username)
      if (url.pathname.includes('/@')) {
        return url.pathname.split('/@')[1].split('/')[0];
      }
      // Legacy user URL
      if (url.pathname.includes('/user/')) {
        return url.pathname.split('/user/')[1].split('/')[0];
      }
    }
    // Direct channel ID or username
    return input.trim();
  };

  const extractInstagramUsername = (input: string): string => {
    // Handle Instagram URLs
    if (input.includes('instagram.com')) {
      const url = new URL(input.startsWith('http') ? input : `https://${input}`);
      const username = url.pathname.split('/')[1];
      return username;
    }
    // Remove @ if present
    return input.trim().replace(/^@/, '');
  };

  const handleYouTubeSearch = async () => {
    if (!youtubeInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a YouTube channel URL, username, or channel ID",
        variant: "destructive",
      });
      return;
    }

    setLoadingYoutube(true);
    try {
      const identifier = extractYouTubeIdentifier(youtubeInput);
      
      // Try to get channel ID if it's a username
      let channelId = identifier;
      if (!identifier.startsWith('UC')) {
        const searchedChannelId = await youtubeAPI.getChannelIdByUsername(identifier);
        if (!searchedChannelId) {
          throw new Error("Channel not found");
        }
        channelId = searchedChannelId;
      }

      // Fetch channel stats
      const stats = await youtubeAPI.getChannelStats(channelId);
      if (!stats) {
        throw new Error("Failed to fetch channel data");
      }

      const videos = await youtubeAPI.getRecentVideos(channelId, 10);

      toast({
        title: "Success",
        description: "YouTube channel data loaded successfully",
      });

      onYouTubeData?.(channelId, { stats, videos });
    } catch (error: any) {
      console.error("YouTube search error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch YouTube data. Please check the channel URL or username.",
        variant: "destructive",
      });
    } finally {
      setLoadingYoutube(false);
    }
  };

  const handleInstagramSearch = async () => {
    if (!instagramInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an Instagram username or profile URL",
        variant: "destructive",
      });
      return;
    }

    setLoadingInstagram(true);
    try {
      const username = extractInstagramUsername(instagramInput);
      
      toast({
        title: "Instagram Integration",
        description: "Instagram's official API requires OAuth authentication. Public profile data access is limited. Consider using Instagram's official OAuth flow for full analytics.",
        variant: "destructive",
      });

      // Note: Instagram Graph API requires OAuth for any meaningful data
      // For public profile data, you would need to use third-party services
      // or implement Instagram Basic Display API with OAuth
      
      onInstagramData?.(username, { message: "OAuth required for Instagram data" });
    } catch (error: any) {
      console.error("Instagram search error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Instagram data",
        variant: "destructive",
      });
    } finally {
      setLoadingInstagram(false);
    }
  };

  return (
    <Card className="glass-card p-6 mb-6">
      <h3 className="font-semibold mb-4">Search Social Media Accounts</h3>
      <div className="space-y-4">
        {/* YouTube Search */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube Channel
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Channel URL, username, or channel ID (e.g., @channelname)"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleYouTubeSearch()}
              className="bg-secondary/50"
            />
            <Button 
              onClick={handleYouTubeSearch}
              disabled={loadingYoutube}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90"
            >
              {loadingYoutube ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Instagram Search */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram Profile
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Username or profile URL (e.g., @username)"
              value={instagramInput}
              onChange={(e) => setInstagramInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInstagramSearch()}
              className="bg-secondary/50"
            />
            <Button 
              onClick={handleInstagramSearch}
              disabled={loadingInstagram}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
            >
              {loadingInstagram ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: Instagram requires OAuth authentication for full analytics access
          </p>
        </div>
      </div>
    </Card>
  );
};
