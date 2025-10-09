// Minimal YouTube Data API v3 client for channel analytics
import { YOUTUBE_CONFIG } from "@/config/youtube";

export interface YouTubeChannelStats {
  viewCount: number;
  subscriberCount: number;
  videoCount: number;
}

export interface YouTubeVideoMetric {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

class YouTubeAPI {
  private apiKey: string;

  constructor(apiKey: string = YOUTUBE_CONFIG.API_KEY) {
    this.apiKey = apiKey;
  }

  async getChannelIdByUsername(usernameOrHandle: string): Promise<string | null> {
    const url = new URL(`${YOUTUBE_CONFIG.BASE_URL}/search`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", usernameOrHandle);
    url.searchParams.set("type", "channel");
    url.searchParams.set("key", this.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    return data?.items?.[0]?.id?.channelId || null;
  }

  async getChannelStats(channelId: string): Promise<YouTubeChannelStats | null> {
    const url = new URL(`${YOUTUBE_CONFIG.BASE_URL}/channels`);
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", channelId);
    url.searchParams.set("key", this.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const stats = data?.items?.[0]?.statistics;
    if (!stats) return null;
    return {
      viewCount: Number(stats.viewCount || 0),
      subscriberCount: Number(stats.subscriberCount || 0),
      videoCount: Number(stats.videoCount || 0),
    };
  }

  async getRecentVideos(channelId: string, maxResults: number = 10): Promise<YouTubeVideoMetric[]> {
    const searchUrl = new URL(`${YOUTUBE_CONFIG.BASE_URL}/search`);
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("channelId", channelId);
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("maxResults", String(maxResults));
    searchUrl.searchParams.set("key", this.apiKey);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const videoIds = searchData.items.map((i: any) => i.id.videoId).filter(Boolean);
    if (videoIds.length === 0) return [];

    const detailsUrl = new URL(`${YOUTUBE_CONFIG.BASE_URL}/videos`);
    detailsUrl.searchParams.set("part", "statistics,snippet");
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("key", this.apiKey);

    const detailsRes = await fetch(detailsUrl.toString());
    if (!detailsRes.ok) return [];
    const detailsData = await detailsRes.json();
    return detailsData.items.map((v: any) => ({
      id: v.id,
      title: v.snippet.title,
      publishedAt: v.snippet.publishedAt,
      viewCount: Number(v.statistics.viewCount || 0),
      likeCount: Number(v.statistics.likeCount || 0),
      commentCount: Number(v.statistics.commentCount || 0),
    }));
  }
}

export const youtubeAPI = new YouTubeAPI();


