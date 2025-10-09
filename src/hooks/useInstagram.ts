import { useState, useEffect } from 'react';
import { getInstagramAPI, InstagramService, InstagramAccount, InstagramMedia, InstagramInsights } from '@/integrations/instagram/client';

interface UseInstagramReturn {
  account: InstagramAccount | null;
  media: InstagramMedia[];
  insights: InstagramInsights | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isConnected: boolean;
}

export const useInstagram = (instagramAccountId?: string): UseInstagramReturn => {
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [insights, setInsights] = useState<InstagramInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchData = async () => {
    if (!instagramAccountId) {
      setError('No Instagram account ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Test connection first
      const connected = await getInstagramAPI().testConnection();
      setIsConnected(connected);

      if (!connected) {
        throw new Error('Unable to connect to Instagram API. Please check your access token.');
      }

      // Fetch comprehensive data
      const data = await InstagramService.getAccountData(instagramAccountId);
      
      setAccount(data.account);
      setMedia(data.media);
      setInsights(data.insights);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Instagram data');
      console.error('Instagram data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (instagramAccountId) {
      fetchData();
    }
  }, [instagramAccountId]);

  return {
    account,
    media,
    insights,
    loading,
    error,
    refresh,
    isConnected
  };
};

// Hook for media with insights
export const useInstagramMedia = (instagramAccountId?: string, limit: number = 10) => {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    if (!instagramAccountId) {
      setError('No Instagram account ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mediaWithInsights = await InstagramService.getMediaWithInsights(instagramAccountId, limit);
      setMedia(mediaWithInsights);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Instagram media');
      console.error('Instagram media fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instagramAccountId) {
      fetchMedia();
    }
  }, [instagramAccountId, limit]);

  return {
    media,
    loading,
    error,
    refresh: fetchMedia
  };
};

// Hook for testing Instagram connection
export const useInstagramConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const connected = await instagramAPI.testConnection();
      setIsConnected(connected);
      
      if (!connected) {
        setError('Instagram API connection failed. Please check your access token.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to test Instagram connection');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    isConnected,
    loading,
    error,
    testConnection
  };
};

