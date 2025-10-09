# Instagram Graph API Integration

This document describes the Instagram Graph API integration implemented in CloudNyn for fetching Instagram Business Account insights and analytics.

## 🔑 Access Token Information

**Token**: `EAATCet7fNtsBPlpc24xx3uQDjioIvZCnVhZCU3O8OXa5ZAbWshWvLrbe1IVoEP7RleQItPzhxrGMxr3wp9TvoHTGOEQSsk6DyYhSRHNY8rzugfSAG09PVBsZBslX0Q1A2qA9rYSMGaJvTVUTUljA9FfOBwYZBsLnAZAfjZBMxM1jdTcZBzuB6fNQsFezVjYDK08H2wJmJgmVZCV4Wa2PjZCMU5ZAv2eBW1jvRYWXkbZABSmVlWyaVkgZD`

**Permissions**: 
- `email` - Access to user email
- `read_insights` - Read Instagram Business Account insights

## 📁 File Structure

```
src/
├── integrations/
│   └── instagram/
│       └── client.ts              # Main Instagram API service
├── hooks/
│   └── useInstagram.ts            # React hooks for Instagram data
├── components/
│   └── dashboard/
│       ├── InstagramConnection.tsx    # Connection management component
│       ├── InstagramInsights.tsx      # Insights display component
│       └── InstagramErrorBoundary.tsx # Error handling component
├── config/
│   └── instagram.ts               # Configuration and constants
└── pages/
    └── Dashboard.tsx              # Updated dashboard with Instagram integration
```

## 🚀 Features Implemented

### 1. Instagram API Service (`src/integrations/instagram/client.ts`)
- **Account Information**: Fetch basic account details (followers, following, posts count)
- **Media Insights**: Get insights for individual posts (impressions, reach, engagement)
- **Account Insights**: Fetch account-level analytics (impressions, reach, profile views)
- **Error Handling**: Comprehensive error handling with specific error messages
- **Rate Limiting**: Built-in rate limiting awareness
- **Token Validation**: Automatic token permission checking

### 2. React Hooks (`src/hooks/useInstagram.ts`)
- **`useInstagram`**: Main hook for account data, media, and insights
- **`useInstagramMedia`**: Specialized hook for media with insights
- **`useInstagramConnection`**: Connection testing and validation
- **Automatic Refresh**: Built-in refresh functionality
- **Loading States**: Proper loading and error states

### 3. UI Components

#### InstagramConnection Component
- **Account ID Input**: Secure input for Instagram Business Account ID
- **Connection Testing**: Real-time connection validation
- **Status Display**: Visual connection status indicators
- **Error Messages**: User-friendly error messages

#### InstagramInsights Component
- **Account Overview**: Follower count, following, posts, engagement rate
- **Insights Dashboard**: Impressions, reach, profile views
- **Recent Media**: Visual grid of recent posts with metrics
- **Real-time Data**: Live data fetching and display

#### Error Boundary
- **Graceful Degradation**: Fallback UI for errors
- **Retry Functionality**: Easy retry mechanisms
- **Error Reporting**: Detailed error information

## 🔧 Configuration

### Instagram API Configuration (`src/config/instagram.ts`)
```typescript
export const INSTAGRAM_CONFIG = {
  ACCESS_TOKEN: "your_access_token_here",
  API_VERSION: "v18.0",
  BASE_URL: "https://graph.facebook.com",
  RATE_LIMIT: {
    REQUESTS_PER_HOUR: 200,
    REQUESTS_PER_DAY: 4800
  },
  DEFAULTS: {
    MEDIA_LIMIT: 25,
    INSIGHTS_PERIOD: "day",
    INSIGHTS_METRICS: [...],
    MEDIA_INSIGHTS_METRICS: [...]
  }
}
```

## 📊 Data Types

### InstagramAccount
```typescript
interface InstagramAccount {
  id: string;
  name: string;
  username: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
}
```

### InstagramMedia
```typescript
interface InstagramMedia {
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
```

### InstagramInsights
```typescript
interface InstagramInsights {
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
```

## 🎯 Usage Examples

### Basic Usage
```typescript
import { useInstagram } from '@/hooks/useInstagram';

const MyComponent = () => {
  const { account, media, insights, loading, error, refresh } = useInstagram('instagram_account_id');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>@{account?.username}</h1>
      <p>Followers: {account?.followers_count}</p>
      <p>Impressions: {insights?.impressions}</p>
    </div>
  );
};
```

### Media with Insights
```typescript
import { useInstagramMedia } from '@/hooks/useInstagram';

const MediaComponent = () => {
  const { media, loading, error } = useInstagramMedia('instagram_account_id', 10);
  
  return (
    <div>
      {media.map(post => (
        <div key={post.id}>
          <img src={post.media_url} alt="Post" />
          <p>Likes: {post.like_count}</p>
          <p>Impressions: {post.insights?.impressions}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🔒 Security Considerations

1. **Access Token**: Stored securely in configuration
2. **Account ID Validation**: Validates Instagram Business Account ID format
3. **Error Handling**: No sensitive data exposed in error messages
4. **Rate Limiting**: Respects Instagram API rate limits
5. **Permission Checking**: Validates token permissions before making requests

## 🚨 Error Handling

### Common Errors
- **Invalid Token**: Token expired or invalid
- **Rate Limit**: Too many requests
- **Permission Denied**: Insufficient permissions
- **Account Not Found**: Invalid Instagram Business Account ID
- **Connection Failed**: Network or API issues

### Error Recovery
- **Automatic Retry**: Built-in retry mechanisms
- **User Feedback**: Clear error messages
- **Graceful Degradation**: Fallback UI components
- **Error Boundaries**: React error boundaries for component isolation

## 📈 Performance Optimizations

1. **Caching**: Local storage for account ID
2. **Lazy Loading**: Components load data on demand
3. **Error Boundaries**: Isolated error handling
4. **Rate Limiting**: Prevents API abuse
5. **Efficient Requests**: Batched API calls where possible

## 🔄 Integration with Dashboard

The Instagram integration is seamlessly integrated into the main dashboard:

1. **Instagram Analytics Section**: New section in dashboard
2. **Connection Management**: Easy account connection
3. **Real-time Insights**: Live data display
4. **Error Handling**: Graceful error states
5. **Responsive Design**: Mobile-friendly interface

## 🛠️ Development Notes

- **TypeScript**: Fully typed for better development experience
- **React Hooks**: Modern React patterns
- **Error Boundaries**: Robust error handling
- **Configuration**: Centralized configuration management
- **Testing**: Error boundary testing included

## 📝 Next Steps

1. **Token Refresh**: Implement automatic token refresh
2. **Caching**: Add Redis or similar caching layer
3. **Analytics**: Add usage analytics
4. **Webhooks**: Real-time data updates
5. **Multiple Accounts**: Support for multiple Instagram accounts

---

**Note**: This integration requires a valid Instagram Business Account and proper Facebook App permissions. The access token provided has the necessary permissions for email and read_insights operations.

