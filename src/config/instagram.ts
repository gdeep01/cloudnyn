// Instagram API Configuration
export const INSTAGRAM_CONFIG = {
  // Access token with permissions: email, read_insights
  ACCESS_TOKEN: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || "",
  
  // API Configuration
  API_VERSION: "v18.0",
  BASE_URL: "https://graph.facebook.com",
  
  // Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_HOUR: 200,
    REQUESTS_PER_DAY: 4800
  },
  
  // Default parameters
  DEFAULTS: {
    MEDIA_LIMIT: 25,
    INSIGHTS_PERIOD: "day",
    INSIGHTS_METRICS: [
      'impressions',
      'reach', 
      'profile_views',
      'website_clicks',
      'email_contacts',
      'phone_call_clicks',
      'text_message_clicks',
      'get_directions_clicks',
      'follower_count',
      'audience_city',
      'audience_country',
      'audience_gender_age',
      'online_followers'
    ],
    MEDIA_INSIGHTS_METRICS: [
      'impressions',
      'reach',
      'engagement',
      'saved',
      'video_views'
    ]
  },
  
  // Error messages
  ERRORS: {
    INVALID_TOKEN: "Invalid or expired access token",
    RATE_LIMIT: "Rate limit exceeded. Please try again later",
    PERMISSION_DENIED: "Insufficient permissions for this operation",
    ACCOUNT_NOT_FOUND: "Instagram Business account not found",
    CONNECTION_FAILED: "Failed to connect to Instagram API"
  }
} as const;

// Helper function to check if token has required permissions
export const checkTokenPermissions = async (): Promise<{ valid: boolean; permissions: string[]; error?: string }> => {
  try {
    const response = await fetch(
      `${INSTAGRAM_CONFIG.BASE_URL}/${INSTAGRAM_CONFIG.API_VERSION}/me/permissions?access_token=${INSTAGRAM_CONFIG.ACCESS_TOKEN}`
    );
    
    if (!response.ok) {
      return { valid: false, permissions: [], error: "Failed to check token permissions" };
    }
    
    const data = await response.json();
    const permissions = data.data?.map((perm: any) => perm.permission) || [];
    
    return {
      valid: permissions.includes('email') && permissions.includes('read_insights'),
      permissions
    };
  } catch (error) {
    return { 
      valid: false, 
      permissions: [], 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Helper function to validate Instagram Business Account ID
export const validateAccountId = (accountId: string): boolean => {
  // Instagram Business Account IDs are typically numeric strings
  return /^\d+$/.test(accountId) && accountId.length > 0;
};

