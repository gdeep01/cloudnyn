import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OAuthCallbackGoogle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };

  const handleCancel = () => {
    navigate("/auth");
  };

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const errorParam = params.get("error");
      
      if (errorParam) {
        const errorDescription = params.get("error_description") || "Google authorization was denied or failed";
        setError(errorDescription);
        setIsLoading(false);
        toast({
          title: "Authorization Failed",
          description: errorDescription,
          variant: "destructive",
        });
        return;
      }

      if (!code) {
        setError("No authorization code received from Google");
        setIsLoading(false);
        toast({
          title: "Connection Error",
          description: "No authorization code received from Google",
          variant: "destructive",
        });
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE || ''}/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent('web')}`, 
          { credentials: 'include' }
        );
        
        const data = await res.json();
        
        if (!res.ok || data.error) {
          throw new Error(data.error || `Server error: ${res.status}`);
        }

        localStorage.setItem("google_access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("google_refresh_token", data.refresh_token);
        }

        toast({
          title: "Success!",
          description: "Google/YouTube account connected successfully",
        });

        navigate("/dashboard");
      } catch (e: any) {
        const errorMessage = e.message || "Failed to connect Google account";
        setError(errorMessage);
        setIsLoading(false);
        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    run();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
      <Card className="glass-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
            <Youtube className="w-8 h-8 text-white" />
          </div>

          {isLoading && !error ? (
            <>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Connecting Google</h2>
              </div>
              <p className="text-muted-foreground text-center">
                Please wait while we connect your Google/YouTube account...
              </p>
            </>
          ) : error ? (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {error}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Back to Login
                </Button>
                <Button 
                  onClick={handleRetry}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default OAuthCallbackGoogle;


