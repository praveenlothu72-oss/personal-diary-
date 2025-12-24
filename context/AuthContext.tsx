
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; unverified?: boolean }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>;
  logout: () => void;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get the correct redirect URL for GitHub Pages / Netlify / Localhost
const getRedirectUrl = () => {
  // Removes trailing slashes and ensures sub-directories are included
  return window.location.origin + window.location.pathname.replace(/\/$/, '');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = (supabaseUser: any): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0],
    bio: supabaseUser.user_metadata?.bio || '',
    emailConfirmed: !!supabaseUser.email_confirmed_at,
  });

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      setUser(mapUser(supabaseUser));
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      }
      setLoading(false);
    });

    // Listen for auth changes (including clicking the confirmation link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event);
      if (session?.user) {
        setUser(mapUser(session.user));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      const isUnverified = error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verified');
      return { 
        success: false, 
        error: error.message,
        unverified: isUnverified 
      };
    }
    return { success: true };
  };

  const signup = async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { username },
        emailRedirectTo: getRedirectUrl()
      },
    });
    
    if (error) return { success: false, error: error.message };
    
    const needsVerification = data.user && !data.user.email_confirmed_at;
    return { success: true, needsVerification };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    
    if (error) return { success: false, error: error.message };
    
    // Explicitly refresh user data to ensure the UI updates with confirmed status
    if (data.user) {
      const { data: { user: refreshedUser } } = await supabase.auth.getUser();
      if (refreshedUser) {
        setUser(mapUser(refreshedUser));
        return { success: true };
      }
    }
    return { success: false, error: 'Verification failed' };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: getRedirectUrl()
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = async (data: Partial<User>) => {
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        username: data.username,
        bio: data.bio,
      }
    });
    
    if (!authError && user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, resendVerification, verifyOtp, refreshUser, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
