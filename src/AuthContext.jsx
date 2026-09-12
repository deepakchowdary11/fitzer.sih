import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatUser = (supabaseUser) => {
    if (!supabaseUser) return null;
    const meta = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'Athlete',
      username: meta.username || meta.preferred_username || supabaseUser.email?.split('@')[0] || 'athlete',
      avatar_url: meta.avatar_url || meta.picture || null,
      user_metadata: meta,
    };
  };

  useEffect(() => {
    // 1. Retrieve initial session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Fitzer Auth] Error getting session:', error.message);
      }
      setSession(session);
      if (session?.user) {
        const u = formatUser(session.user);
        setUser(u);
        localStorage.setItem('fitzer.user', JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem('fitzer.user');
      }
      setLoading(false);
    }).catch((err) => {
      console.error('[Fitzer Auth] Exception retrieving session:', err);
      setLoading(false);
    });

    // 2. Listen for real-time auth state updates (e.g. Google OAuth return, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const u = formatUser(newSession.user);
        setUser(u);
        const isCompleted = localStorage.getItem(`fitzer_onboarding_completed_${u.id}`) === 'true';
        const targetRoute = isCompleted ? '#/exercise' : '#/onboarding';
        const currentHash = window.location.hash || '';
        if (event === 'SIGNED_IN' && (currentHash === '#/login' || currentHash === '#/' || currentHash === '' || currentHash.includes('access_token='))) {
          window.location.hash = targetRoute;
        }
      } else {
        setUser(null);
        localStorage.removeItem('fitzer.user');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, name, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split('@')[0],
          name: name || email.split('@')[0],
          username: username || email.split('@')[0],
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    // Current web origin + base path (preserves localhost or production domain)
    const redirectUrl = window.location.origin + window.location.pathname;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('[Fitzer Auth] SignOut error:', error.message);
    } finally {
      localStorage.removeItem('fitzer.user');
      setUser(null);
      setSession(null);
      window.location.hash = '#/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAuthenticated: !!session?.user,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
