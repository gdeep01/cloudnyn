import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface UseAuthSimpleReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuthSimple = (): UseAuthSimpleReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('cloudnyn_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      const userData = {
        id: 'demo-user-123',
        email: email,
        created_at: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('cloudnyn_user', JSON.stringify(userData));
      
      toast({
        title: "Success",
        description: "Signed in successfully!",
      });

      // Navigate to dashboard after successful sign-in
      navigate('/dashboard');
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      const userData = {
        id: 'demo-user-123',
        email: email,
        created_at: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('cloudnyn_user', JSON.stringify(userData));
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      // Navigate to dashboard after sign up
      navigate('/dashboard');
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
      
      setUser(null);
      localStorage.removeItem('cloudnyn_user');
      
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

