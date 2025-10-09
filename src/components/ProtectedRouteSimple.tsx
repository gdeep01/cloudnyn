import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteSimpleProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRouteSimple = ({ children, requireAuth = true }: ProtectedRouteSimpleProps) => {
  const { user, loading, isAuthenticated } = useAuthSimple();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate('/auth');
      } else if (!requireAuth && isAuthenticated) {
        navigate('/dashboard');
      }
    }
  }, [loading, isAuthenticated, requireAuth, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to auth
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
};

