import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Instagram, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useInstagramConnection } from '@/hooks/useInstagram';
import { useToast } from '@/hooks/use-toast';

export const InstagramConnection = () => {
  const [instagramAccountId, setInstagramAccountId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { isConnected, loading, error, testConnection } = useInstagramConnection();

  const handleConnect = async () => {
    if (!instagramAccountId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Instagram Business Account ID",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Test the connection with the provided account ID
      await testConnection();
      
      if (isConnected) {
        // Store the account ID in localStorage for future use
        localStorage.setItem('instagramAccountId', instagramAccountId);
        
        toast({
          title: "Success",
          description: "Instagram account connected successfully!",
        });
      } else {
        throw new Error('Failed to connect to Instagram account');
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect to Instagram. Please check your account ID.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('instagramAccountId');
    setInstagramAccountId('');
    toast({
      title: "Disconnected",
      description: "Instagram account disconnected",
    });
  };

  const getConnectionStatus = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Testing connection...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Connection failed: {error}</span>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>Connected to Instagram API</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <span>Not connected</span>
      </div>
    );
  };

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Instagram className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Instagram Business Account</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Instagram Business account to get insights
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {getConnectionStatus()}
          
          <div className="space-y-2">
            <label htmlFor="instagram-account-id" className="text-sm font-medium">
              Instagram Business Account ID
            </label>
            <Input
              id="instagram-account-id"
              type="text"
              placeholder="Enter your Instagram Business Account ID"
              value={instagramAccountId}
              onChange={(e) => setInstagramAccountId(e.target.value)}
              disabled={isConnecting}
            />
            <p className="text-xs text-muted-foreground">
              You can find your Instagram Business Account ID in your Facebook Business Manager
            </p>
          </div>

          <div className="flex gap-2">
            {isConnected ? (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="flex-1"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !instagramAccountId.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Instagram className="mr-2 h-4 w-4" />
                    Connect Instagram
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

