// YouTube Data API v3 Configuration
export const YOUTUBE_CONFIG = {
  API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || "",
  BASE_URL: "https://www.googleapis.com/youtube/v3"
} as const;

export const ensureYouTubeApiKey = (): void => {
  if (!YOUTUBE_CONFIG.API_KEY) {
    // eslint-disable-next-line no-console
    console.warn("VITE_YOUTUBE_API_KEY is not set. YouTube features will be disabled.");
  }
};


