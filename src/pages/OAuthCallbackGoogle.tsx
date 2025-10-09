import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { OAUTH_CONFIG } from "@/config/oauth";

const OAuthCallbackGoogle = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        setError("No code returned from Google");
        return;
      }
      try {
        // Exchange via Node backend (ensures cookies/session are set)
        const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent('web')}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Exchange failed");
        localStorage.setItem("google_access_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("google_refresh_token", data.refresh_token);
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
        {error ? <p className="text-destructive">{error}</p> : <p>Connecting your Google account…</p>}
      </Card>
    </div>
  );
};

export default OAuthCallbackGoogle;


