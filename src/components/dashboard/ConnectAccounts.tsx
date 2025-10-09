import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube } from "lucide-react";

export const ConnectAccounts = () => {
  const apiBase = import.meta.env.VITE_API_BASE || '';
  return (
    <Card className="glass-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="font-semibold">Connect Accounts</h3>
          <p className="text-sm text-muted-foreground">Link your Instagram and YouTube accounts to pull analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { window.location.href = `${apiBase}/auth/instagram`; }}>
            <Instagram className="h-4 w-4 mr-2" /> Connect Instagram
          </Button>
          <Button variant="outline" onClick={() => { window.location.href = `${apiBase}/auth/google`; }}>
            <Youtube className="h-4 w-4 mr-2" /> Connect YouTube
          </Button>
        </div>
      </div>
    </Card>
  );
};


