// Google OAuth code exchange (Supabase Edge Function)
// Expects JSON { code, redirectUri } and returns { access_token, refresh_token, expires_in }
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { code, redirectUri } = await req.json();
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    // If Authorization bearer (Supabase anon token) plus X-Client-Auth provided, store to user
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (authHeader && serviceRole) {
      const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
      const jwt = req.headers.get("X-Client-Auth");
      if (jwt) {
        const { data: userData } = await supabase.auth.getUser(jwt);
        const user = userData?.user;
        if (user?.id) {
          await supabase.from("profiles").upsert({ id: user.id, google_access_token: data.access_token, google_refresh_token: data.refresh_token ?? null }, { onConflict: "id" });
        }
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.status,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});


