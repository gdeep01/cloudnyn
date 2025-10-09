import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { useYouTubeAnalytics } from "@/hooks/useYouTubeAnalytics";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { youtubeAPI } from "@/integrations/youtube/client";

export const YouTubePanel = () => {
  const [usernameOrHandle, setUsernameOrHandle] = useState("");
  const [channelId, setChannelId] = useState<string | undefined>(undefined);
  const { stats, videos, loading, error, refresh } = useYouTubeAnalytics(channelId);

  useEffect(() => {
    const stored = localStorage.getItem("youtube_channel_id");
    if (stored) setChannelId(stored);
  }, []);

  const resolveChannel = async () => {
    const id = await youtubeAPI.getChannelIdByUsername(usernameOrHandle.trim());
    if (id) {
      localStorage.setItem("youtube_channel_id", id);
      setChannelId(id);
      await refresh();
    }
  };

  const useDemoChannel = async () => {
    const demoId = "UCX6OQ3DkcsbYNE6H8uQQuVA"; // Public channel ID
    localStorage.setItem("youtube_channel_id", demoId);
    setChannelId(demoId);
    await refresh();
  };

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/80 p-2 rounded-lg">
            <Youtube className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">YouTube Analytics</h3>
            <p className="text-sm text-muted-foreground">Connect a channel to view stats</p>
          </div>
        </div>

        {!channelId && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Channel handle or name</label>
            <div className="flex gap-2">
              <Input value={usernameOrHandle} onChange={(e) => setUsernameOrHandle(e.target.value)} placeholder="@handle or channel name" />
              <Button onClick={resolveChannel} disabled={!usernameOrHandle.trim()}>Connect</Button>
            </div>
            <div>
              <Button variant="ghost" className="text-xs px-2" onClick={useDemoChannel}>Use Demo Channel</Button>
            </div>
          </div>
        )}

        {loading && <p className="text-muted-foreground">Loading YouTube analytics…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {stats && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.subscriberCount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Subscribers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.viewCount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.videoCount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Videos</div>
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recent Videos</h4>
            <div className="grid gap-2">
              {videos.slice(0, 5).map((v) => (
                <div key={v.id} className="text-sm flex items-center justify-between border rounded p-2">
                  <span className="truncate mr-3">{v.title}</span>
                  <span className="text-muted-foreground">{v.viewCount.toLocaleString()} views</span>
                </div>
              ))}
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...videos].reverse().map(v => ({ name: new Date(v.publishedAt).toLocaleDateString(), views: v.viewCount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};


