export const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function fetchInstagramData(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/instagram/account`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Instagram API failed: ${res.status}`);
  return res.json();
}

export async function fetchYouTubeData(channelId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/youtube/analytics?channelId=${encodeURIComponent(channelId)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`YouTube API failed: ${res.status}`);
  return res.json();
}


