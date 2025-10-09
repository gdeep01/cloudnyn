import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || ''
          });
          // Fetch tokens from profiles and hydrate localStorage for immediate use
          try {
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (data?.instagram_access_token) localStorage.setItem('instagram_access_token', data.instagram_access_token);
            if (data?.instagram_user_id) localStorage.setItem('instagram_user_id', data.instagram_user_id);
            if (data?.google_access_token) localStorage.setItem('google_access_token', data.google_access_token);
            if (data?.google_refresh_token) localStorage.setItem('google_refresh_token', data.google_refresh_token);
          } catch {}
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || ''
          });
          // expose access token for edge functions to associate tokens
          try {
            const token = session.access_token;
            if (token) localStorage.setItem('sb-access-token', token);
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (data?.instagram_access_token) localStorage.setItem('instagram_access_token', data.instagram_access_token);
            if (data?.instagram_user_id) localStorage.setItem('instagram_user_id', data.instagram_user_id);
            if (data?.google_access_token) localStorage.setItem('google_access_token', data.google_access_token);
            if (data?.google_refresh_token) localStorage.setItem('google_refresh_token', data.google_refresh_token);
          } catch {}
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('sb-access-token');
          localStorage.removeItem('instagram_access_token');
          localStorage.removeItem('instagram_user_id');
          localStorage.removeItem('google_access_token');
          localStorage.removeItem('google_refresh_token');
          navigate('/auth');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Signed in successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Account created! Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Signed out successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };
};

