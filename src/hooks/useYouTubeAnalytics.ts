import { useEffect, useState } from "react";
import { youtubeAPI, YouTubeChannelStats, YouTubeVideoMetric } from "@/integrations/youtube/client";

export interface YouTubeAnalytics {
  stats: YouTubeChannelStats | null;
  videos: YouTubeVideoMetric[];
}

export const useYouTubeAnalytics = (channelId?: string) => {
  const [data, setData] = useState<YouTubeAnalytics>({ stats: null, videos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!channelId) return;
    setLoading(true);
    setError(null);
    try {
      const [stats, videos] = await Promise.all([
        youtubeAPI.getChannelStats(channelId),
        youtubeAPI.getRecentVideos(channelId, 10),
      ]);
      setData({ stats, videos });
      try { localStorage.setItem('latest_youtube_analytics', JSON.stringify({ stats, videos })); } catch {}
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  return { ...data, loading, error, refresh: fetchData };
};


