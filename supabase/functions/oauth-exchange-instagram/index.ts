// Instagram OAuth code exchange (Supabase Edge Function)
// Expects JSON { code, redirectUri } and returns { access_token, user_id }
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
    const clientId = Deno.env.get("INSTAGRAM_CLIENT_ID")!;
    const clientSecret = Deno.env.get("INSTAGRAM_CLIENT_SECRET")!;

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });

    const res = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    // Persist tokens if client JWT provided
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const jwt = req.headers.get("X-Client-Auth");
    if (jwt && serviceRole) {
      const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
      const { data: userData } = await supabase.auth.getUser(jwt);
      const user = userData?.user;
      if (user?.id) {
        await supabase.from("profiles").upsert({ id: user.id, instagram_access_token: data.access_token, instagram_user_id: data.user_id ?? null }, { onConflict: "id" });
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


