import { useState, useEffect } from 'react';
import { useInstagram } from './useInstagram';
import { analyticsService, AnalyticsData, AIInsights } from '@/services/analyticsService';
import { generatePrescriptionsWithGemini } from '@/services/geminiService';

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null;
  aiInsights: AIInsights | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasData: boolean;
}

export const useAnalytics = (instagramAccountId?: string): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { account, media, insights, loading: instagramLoading, error: instagramError, refresh: refreshInstagram } = useInstagram(instagramAccountId);

  const processData = async () => {
    if (!account || !media || !insights) {
      setAnalytics(null);
      setAIInsights(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Process Instagram data into analytics
      const processedAnalytics = analyticsService.processInstagramData(account, media, insights);
      setAnalytics(processedAnalytics);
      try { localStorage.setItem('latest_instagram_analytics', JSON.stringify(processedAnalytics)); } catch {}

      // Generate AI insights locally first
      let generatedInsights = analyticsService.generateAIInsights(processedAnalytics, media);

      // Optionally augment with Gemini if API key is provided
      const gemini = await generatePrescriptionsWithGemini(processedAnalytics, 'instagram');
      if (gemini) {
        generatedInsights = {
          ...generatedInsights,
          contentSuggestions: gemini.weeklyPlan.map((p) => ({
            day: p.day,
            time: p.time,
            type: p.contentType,
            topic: p.idea,
            hashtags: p.hashtags.join(' '),
            reasoning: 'Gemini-assisted recommendation',
          })),
        } as any;
      }

      setAIInsights(generatedInsights);
      try { localStorage.setItem('latest_ai_recommendations', JSON.stringify(generatedInsights)); } catch {}
    } catch (err: any) {
      setError(err.message || 'Failed to process analytics data');
      console.error('Analytics processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await refreshInstagram();
    await processData();
  };

  useEffect(() => {
    if (instagramLoading) {
      setLoading(true);
    } else if (instagramError) {
      setError(instagramError);
      setLoading(false);
    } else if (account && media && insights) {
      processData();
    } else {
      setLoading(false);
    }
  }, [account, media, insights, instagramLoading, instagramError]);

  return {
    analytics,
    aiInsights,
    loading: loading || instagramLoading,
    error: error || instagramError,
    refresh,
    hasData: !!(analytics && aiInsights)
  };
};

