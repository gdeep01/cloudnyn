// Analytics Service - Real data processing and AI insights
import { InstagramAccount, InstagramMedia, InstagramInsights } from '@/integrations/instagram/client';

export interface AnalyticsData {
  totalEngagement: number;
  totalReach: number;
  totalLikes: number;
  engagementRate: number;
  reachGrowth: number;
  likesGrowth: number;
  bestPostingTimes: Array<{ time: string; engagement: number; retention: number }>;
  contentPerformance: Array<{ type: string; performance: number; growth: string }>;
  weeklyData: Array<{ date: string; engagement: number; reach: number; likes: number }>;
}

export interface AIInsights {
  recommendedPostingTimes: string[];
  topPerformingContentTypes: string[];
  suggestedHashtags: string[];
  audienceInsights: {
    peakActivityHours: string[];
    preferredContentTypes: string[];
    engagementPatterns: string[];
  };
  contentSuggestions: Array<{
    day: string;
    time: string;
    type: string;
    topic: string;
    hashtags: string[];
    reasoning: string;
  }>;
}

class AnalyticsService {
  // Process Instagram data into analytics
  processInstagramData(account: InstagramAccount, media: InstagramMedia[], insights: InstagramInsights): AnalyticsData {
    // Calculate total engagement from media
    const totalEngagement = media.reduce((sum, post) => {
      return sum + (post.like_count + post.comments_count);
    }, 0);

    // Calculate total reach from insights
    const totalReach = insights?.reach || 0;
    
    // Calculate total likes
    const totalLikes = media.reduce((sum, post) => sum + post.like_count, 0);

    // Calculate engagement rate
    const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;

    // Generate weekly data from media timestamps
    const weeklyData = this.generateWeeklyData(media);

    // Analyze best posting times
    const bestPostingTimes = this.analyzePostingTimes(media);

    // Analyze content performance
    const contentPerformance = this.analyzeContentPerformance(media);

    return {
      totalEngagement,
      totalReach,
      totalLikes,
      engagementRate: Math.round(engagementRate * 100) / 100,
      reachGrowth: this.calculateGrowthRate(insights?.reach || 0, account.followers_count),
      likesGrowth: this.calculateGrowthRate(totalLikes, media.length),
      bestPostingTimes,
      contentPerformance,
      weeklyData
    };
  }

  // Generate AI insights based on data analysis
  generateAIInsights(analytics: AnalyticsData, media: InstagramMedia[]): AIInsights {
    // Analyze posting patterns
    const postingTimes = this.extractPostingTimes(media);
    const contentTypes = this.analyzeContentTypes(media);
    const hashtags = this.extractHashtags(media);

    // Generate recommendations
    const recommendedPostingTimes = this.getOptimalPostingTimes(postingTimes);
    const topPerformingContentTypes = this.getTopContentTypes(contentTypes);
    const suggestedHashtags = this.getSuggestedHashtags(hashtags);

    // Generate content suggestions for next 7 days
    const contentSuggestions = this.generateContentSuggestions(
      recommendedPostingTimes,
      topPerformingContentTypes,
      suggestedHashtags
    );

    return {
      recommendedPostingTimes,
      topPerformingContentTypes,
      suggestedHashtags,
      audienceInsights: {
        peakActivityHours: recommendedPostingTimes,
        preferredContentTypes: topPerformingContentTypes,
        engagementPatterns: this.analyzeEngagementPatterns(media)
      },
      contentSuggestions
    };
  }

  // Helper methods
  private generateWeeklyData(media: InstagramMedia[]) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const dayMedia = media.filter(post => {
        const postDay = new Date(post.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
        return postDay === day;
      });

      const engagement = dayMedia.reduce((sum, post) => sum + post.like_count + post.comments_count, 0);
      const reach = dayMedia.reduce((sum, post) => sum + (post.insights?.reach || 0), 0);
      const likes = dayMedia.reduce((sum, post) => sum + post.like_count, 0);

      return { date: day, engagement, reach, likes };
    });
  }

  private analyzePostingTimes(media: InstagramMedia[]) {
    const timeSlots = [
      { time: "Morning", start: 6, end: 12 },
      { time: "Afternoon", start: 12, end: 18 },
      { time: "Evening", start: 18, end: 22 },
      { time: "Night", start: 22, end: 6 }
    ];

    return timeSlots.map(slot => {
      const slotMedia = media.filter(post => {
        const hour = new Date(post.timestamp).getHours();
        return slot.start <= hour && hour < slot.end;
      });

      const engagement = slotMedia.reduce((sum, post) => sum + post.like_count + post.comments_count, 0);
      const retention = slotMedia.length > 0 ? (engagement / slotMedia.length) : 0;

      return {
        time: slot.time,
        engagement: Math.round(engagement),
        retention: Math.round(retention)
      };
    });
  }

  private analyzeContentPerformance(media: InstagramMedia[]) {
    const contentTypes = ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'];
    
    return contentTypes.map(type => {
      const typeMedia = media.filter(post => post.media_type === type);
      const totalEngagement = typeMedia.reduce((sum, post) => sum + post.like_count + post.comments_count, 0);
      const performance = typeMedia.length > 0 ? (totalEngagement / typeMedia.length) : 0;
      const growth = this.calculateGrowthRate(performance, 100);

      return {
        type: type.replace('_', ' '),
        performance: Math.round(performance),
        growth: `+${Math.round(growth)}%`
      };
    });
  }

  private extractPostingTimes(media: InstagramMedia[]) {
    return media.map(post => new Date(post.timestamp).getHours());
  }

  private analyzeContentTypes(media: InstagramMedia[]) {
    const typeCounts: Record<string, number> = {};
    media.forEach(post => {
      typeCounts[post.media_type] = (typeCounts[post.media_type] || 0) + 1;
    });
    return typeCounts;
  }

  private extractHashtags(media: InstagramMedia[]) {
    const hashtags: string[] = [];
    media.forEach(post => {
      if (post.caption) {
        const matches = post.caption.match(/#\w+/g);
        if (matches) {
          hashtags.push(...matches);
        }
      }
    });
    return hashtags;
  }

  private getOptimalPostingTimes(postingTimes: number[]) {
    const hourCounts: Record<number, number> = {};
    postingTimes.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);
  }

  private getTopContentTypes(contentTypes: Record<string, number>) {
    return Object.entries(contentTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([type]) => type.replace('_', ' '));
  }

  private getSuggestedHashtags(hashtags: string[]) {
    const hashtagCounts: Record<string, number> = {};
    hashtags.forEach(tag => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });

    return Object.entries(hashtagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  private generateContentSuggestions(
    postingTimes: string[],
    contentTypes: string[],
    hashtags: string[]
  ) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const topics = [
      'Behind-the-scenes content',
      'Tips & tricks in your niche',
      'Trending challenge or meme',
      'Community engagement question',
      'Educational content',
      'Personal story',
      'Product showcase'
    ];

    return days.map((day, index) => {
      const time = postingTimes[index % postingTimes.length] || '6:00 PM';
      const type = contentTypes[index % contentTypes.length] || 'Post';
      const topic = topics[index % topics.length];
      const dayHashtags = hashtags.slice(index * 3, (index + 1) * 3);

      return {
        day,
        time,
        type,
        topic,
        hashtags: dayHashtags,
        reasoning: `Based on your ${type.toLowerCase()} performance and audience engagement patterns`
      };
    });
  }

  private analyzeEngagementPatterns(media: InstagramMedia[]) {
    const patterns: string[] = [];
    
    // Analyze engagement by day of week
    const dayEngagement: Record<string, number> = {};
    media.forEach(post => {
      const day = new Date(post.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      dayEngagement[day] = (dayEngagement[day] || 0) + post.like_count + post.comments_count;
    });

    const bestDay = Object.entries(dayEngagement).sort(([,a], [,b]) => b - a)[0];
    if (bestDay) {
      patterns.push(`Highest engagement on ${bestDay[0]}`);
    }

    return patterns;
  }

  private calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}

export const analyticsService = new AnalyticsService();

