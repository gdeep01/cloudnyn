import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { OAUTH_CONFIG } from "@/config/oauth";

const OAuthCallbackInstagram = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        setError("No code returned from Instagram");
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/auth/instagram/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent('web')}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Exchange failed");
        localStorage.setItem("instagram_access_token", data.access_token);
        if (data.user_id) localStorage.setItem("instagram_user_id", String(data.user_id));
        navigate("/dashboard");
      } catch (e: any) {
        setError(e.message || String(e));
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="glass-card p-6 w-full max-w-md text-center">
        {error ? <p className="text-destructive">{error}</p> : <p>Connecting your Instagram account…</p>}
      </Card>
    </div>
  );
};

export default OAuthCallbackInstagram;


