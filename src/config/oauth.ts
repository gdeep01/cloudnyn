// OAuth configuration placeholders (client-side initiation)
// Perform code exchange securely on your backend.

export const OAUTH_CONFIG = {
  instagram: {
    clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || "",
    redirectUri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || "http://localhost:8080/auth/instagram/callback",
    authUrl: "https://api.instagram.com/oauth/authorize",
    scope: "user_profile,user_media",
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:8080/auth/google/callback",
    scope: "https://www.googleapis.com/auth/youtube.readonly openid email profile",
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  },
} as const;


