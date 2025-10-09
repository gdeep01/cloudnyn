import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import cloudnynLogo from "@/assets/cloudnyn-logo.svg";
import { useAuthSimple } from "@/hooks/useAuthSimple";
import { ProtectedRouteSimple } from "@/components/ProtectedRouteSimple";
import { OAUTH_CONFIG } from "@/config/oauth";
import { Instagram, Youtube } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SimpleAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, loading } = useAuthSimple();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = authSchema.parse({ email, password });

      if (isLogin) {
        await signIn(validatedData.email, validatedData.password);
      } else {
        await signUp(validatedData.email, validatedData.password);
      }
    } catch (error: any) {
      if (error.message) {
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <ProtectedRouteSimple requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900">
        <Card className="glass-card p-8 w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <img src={cloudnynLogo} alt="CloudNyn" className="h-8 w-auto" />
              <h1 className="text-3xl font-bold gradient-text">CloudNyn</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-300">
              {isLogin 
                ? "Sign in to access your AI-powered social media insights"
                : "Start your free trial and transform your social media strategy"
              }
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-400 hover:underline"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <Button
              variant="outline"
              className="w-full"
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
    </ProtectedRouteSimple>
  );
};

export default SimpleAuth;

