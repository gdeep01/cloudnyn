// Instagram Graph API Integration
// This service handles Instagram Business Account data fetching using the provided access token

import { INSTAGRAM_CONFIG, checkTokenPermissions, validateAccountId } from '@/config/instagram';

export interface InstagramAccount {
  id: string;
  name: string;
  username: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
}

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  insights?: {
    impressions: number;
    reach: number;
    engagement: number;
    saved: number;
    video_views?: number;
  };
}

export interface InstagramInsights {
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  email_contacts: number;
  phone_call_clicks: number;
  text_message_clicks: number;
  get_directions_clicks: number;
  follower_count: number;
  audience_city: Array<{ name: string; value: number }>;
  audience_country: Array<{ name: string; value: number }>;
  audience_gender_age: Array<{ name: string; value: number }>;
  online_followers: Array<{ name: string; value: number }>;
}

export interface InstagramError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
  };
}

class InstagramAPI {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string = INSTAGRAM_CONFIG.ACCESS_TOKEN) {
    this.accessToken = accessToken;
    this.baseUrl = `${INSTAGRAM_CONFIG.BASE_URL}/${INSTAGRAM_CONFIG.API_VERSION}`;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add access token to params
    params.access_token = this.accessToken;
    
    // Add all params to URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Instagram API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram API request failed:', error);
      throw error;
    }
  }

  // Get Instagram Business Account information
  async getAccountInfo(instagramAccountId: string): Promise<InstagramAccount> {
    if (!validateAccountId(instagramAccountId)) {
      throw new Error(INSTAGRAM_CONFIG.ERRORS.ACCOUNT_NOT_FOUND);
    }

    const params = {
      fields: 'id,name,username,followers_count,follows_count,media_count,profile_picture_url'
    };
    
    return this.makeRequest<InstagramAccount>(`/${instagramAccountId}`, params);
  }

  // Get recent media posts
  async getRecentMedia(instagramAccountId: string, limit: number = 25): Promise<{ data: InstagramMedia[] }> {
    const params = {
      fields: 'id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count',
      limit: limit.toString()
    };
    
    return this.makeRequest<{ data: InstagramMedia[] }>(`/${instagramAccountId}/media`, params);
  }

  // Get insights for a specific media post
  async getMediaInsights(mediaId: string): Promise<{ data: Array<{ name: string; value: number }> }> {
    const params = {
      metric: INSTAGRAM_CONFIG.DEFAULTS.MEDIA_INSIGHTS_METRICS.join(',')
    };
    
    return this.makeRequest<{ data: Array<{ name: string; value: number }> }>(`/${mediaId}/insights`, params);
  }

  // Get account-level insights
  async getAccountInsights(instagramAccountId: string, since?: string, until?: string): Promise<InstagramInsights> {
    const params: Record<string, string> = {
      metric: INSTAGRAM_CONFIG.DEFAULTS.INSIGHTS_METRICS.join(','),
      period: INSTAGRAM_CONFIG.DEFAULTS.INSIGHTS_PERIOD
    };

    if (since) params.since = since;
    if (until) params.until = until;

    const response = await this.makeRequest<{ data: Array<{ name: string; values: Array<{ value: number }> }> }>(`/${instagramAccountId}/insights`, params);
    
    // Transform the response into a more usable format
    const insights: Partial<InstagramInsights> = {};
    
    response.data.forEach(metric => {
      const latestValue = metric.values[metric.values.length - 1]?.value || 0;
      
      switch (metric.name) {
        case 'impressions':
          insights.impressions = latestValue;
          break;
        case 'reach':
          insights.reach = latestValue;
          break;
        case 'profile_views':
          insights.profile_views = latestValue;
          break;
        case 'website_clicks':
          insights.website_clicks = latestValue;
          break;
        case 'email_contacts':
          insights.email_contacts = latestValue;
          break;
        case 'phone_call_clicks':
          insights.phone_call_clicks = latestValue;
          break;
        case 'text_message_clicks':
          insights.text_message_clicks = latestValue;
          break;
        case 'get_directions_clicks':
          insights.get_directions_clicks = latestValue;
          break;
        case 'follower_count':
          insights.follower_count = latestValue;
          break;
        case 'audience_city':
          insights.audience_city = metric.values.map(v => ({ name: 'Unknown', value: v.value }));
          break;
        case 'audience_country':
          insights.audience_country = metric.values.map(v => ({ name: 'Unknown', value: v.value }));
          break;
        case 'audience_gender_age':
          insights.audience_gender_age = metric.values.map(v => ({ name: 'Unknown', value: v.value }));
          break;
        case 'online_followers':
          insights.online_followers = metric.values.map(v => ({ name: 'Unknown', value: v.value }));
          break;
      }
    });

    return insights as InstagramInsights;
  }

  // Get hashtag insights (if available)
  async getHashtagInsights(hashtag: string): Promise<any> {
    const params = {
      fields: 'name,media_count'
    };
    
    return this.makeRequest(`/ig_hashtag_search`, { ...params, q: hashtag });
  }

  // Test the connection
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/me', { fields: 'id,name' });
      return true;
    } catch (error) {
      console.error('Instagram API connection test failed:', error);
      return false;
    }
  }
}

// Factory to create API instance using stored token when available
export const getInstagramAPI = () => {
  let token = INSTAGRAM_CONFIG.ACCESS_TOKEN;
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('instagram_access_token') : null;
    if (stored) token = stored;
  } catch {}
  return new InstagramAPI(token);
};

// Utility functions for common operations
export const InstagramService = {
  // Get comprehensive account data
  async getAccountData(instagramAccountId: string) {
    try {
      const api = getInstagramAPI();
      const [accountInfo, recentMedia, insights] = await Promise.all([
        api.getAccountInfo(instagramAccountId),
        api.getRecentMedia(instagramAccountId, 10),
        api.getAccountInsights(instagramAccountId)
      ]);

      return {
        account: accountInfo,
        media: recentMedia.data,
        insights
      };
    } catch (error) {
      console.error('Failed to fetch Instagram account data:', error);
      throw error;
    }
  },

  // Get media with insights
  async getMediaWithInsights(instagramAccountId: string, limit: number = 10) {
    try {
      const api = getInstagramAPI();
      const mediaResponse = await api.getRecentMedia(instagramAccountId, limit);
      
      // Get insights for each media item
      const mediaWithInsights = await Promise.all(
        mediaResponse.data.map(async (media) => {
          try {
            const insightsResponse = await api.getMediaInsights(media.id);
            const insights: any = {};
            
            insightsResponse.data.forEach(metric => {
              insights[metric.name] = metric.value;
            });

            return {
              ...media,
              insights
            };
          } catch (error) {
            console.warn(`Failed to get insights for media ${media.id}:`, error);
            return media;
          }
        })
      );

      return mediaWithInsights;
    } catch (error) {
      console.error('Failed to fetch media with insights:', error);
      throw error;
    }
  }
};
