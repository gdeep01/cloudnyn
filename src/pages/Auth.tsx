import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import cloudnynLogo from "@/assets/cloudnyn-logo.png";
import { Instagram, Youtube } from "lucide-react";
import { OAUTH_CONFIG } from "@/config/oauth";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password });

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Welcome to CloudNyn. Redirecting to dashboard...",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "An error occurred during authentication",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="glass-card p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={cloudnynLogo} alt="CloudNyn" className="h-8 w-auto" />
            <h1 className="text-3xl font-bold gradient-text">CloudNyn</h1>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or connect with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={() => {
              const q = new URLSearchParams({
                client_id: OAUTH_CONFIG.instagram.clientId,
                redirect_uri: OAUTH_CONFIG.instagram.redirectUri,
                response_type: "code",
                scope: OAUTH_CONFIG.instagram.scope,
              });
              window.location.href = `${OAUTH_CONFIG.instagram.authUrl}?${q.toString()}`;
            }}
          >
            <Instagram className="mr-2 h-4 w-4" /> Connect Instagram
          </Button>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={() => {
              const q = new URLSearchParams({
                client_id: OAUTH_CONFIG.google.clientId,
                redirect_uri: OAUTH_CONFIG.google.redirectUri,
                response_type: "code",
                access_type: "offline",
                prompt: "consent",
                scope: OAUTH_CONFIG.google.scope,
                include_granted_scopes: "true",
              });
              window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${q.toString()}`;
            }}
          >
            <Youtube className="mr-2 h-4 w-4" /> Connect Google (YouTube)
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
