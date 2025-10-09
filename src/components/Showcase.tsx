import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchInstagramData, fetchYouTubeData } from "@/services/backend";

export const Showcase = () => {
  const [igMedia, setIgMedia] = useState<any[]>([]);
  const [ytVideos, setYtVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE || '';

  useEffect(() => {
    const run = async () => {
      setLoading(true); setError(null);
      try {
        try {
          const ig = await fetchInstagramData();
          setIgMedia((ig?.media?.data || []).slice(0, 8));
        } catch {}
        const channelId = localStorage.getItem('youtube_channel_id');
        if (channelId) {
          const yt = await fetchYouTubeData(channelId);
          setYtVideos((yt?.videos || []).slice(0, 6));
        }
      } catch (e: any) {
        setError(e.message || String(e));
      } finally { setLoading(false); }
    };
    run();
  }, []);

  return (
    <div className="px-6 py-16 space-y-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Instagram Highlights</h3>
            <Button variant="outline" onClick={() => { window.location.href = `${apiBase}/auth/instagram`; }}>Connect</Button>
          </div>
          {loading && <p className="text-muted-foreground">Loading…</p>}
          {error && <p className="text-destructive">{error}</p>}
          {igMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {igMedia.map((m) => (
                <a key={m.id} href={m.permalink} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.media_url} alt={m.caption || 'IG Media'} className="object-cover w-full h-28" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Connect Instagram to see recent posts.</p>
          )}
        </Card>
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">YouTube Latest</h3>
            <Button variant="outline" onClick={() => { window.location.href = `${apiBase}/auth/google`; }}>Connect</Button>
          </div>
          {ytVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ytVideos.map((v) => (
                <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="block border rounded-lg p-2">
                  <div className="text-sm font-medium truncate">{v.snippet?.title}</div>
                  <div className="text-xs text-muted-foreground">{Number(v.statistics?.viewCount || 0).toLocaleString()} views</div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Connect YouTube to see recent videos.</p>
          )}
        </Card>
      </div>
    </div>
  );
};


