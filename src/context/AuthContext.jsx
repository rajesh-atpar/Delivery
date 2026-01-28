import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getUserProfile } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth data from Supabase session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if Supabase is configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.warn('Supabase not configured - skipping auth initialization');
          setIsLoading(false);
          return;
        }

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          // Get user profile
          try {
            const profile = await getUserProfile(session.user.id);
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...profile,
            });
          } catch (profileError) {
            // If profile doesn't exist, use user metadata
            setUser({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              phone: session.user.user_metadata?.phone || '',
              address: session.user.user_metadata?.address || '',
            });
          }
          setToken(session.access_token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (only if Supabase is configured)
    let subscription = null;
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              const profile = await getUserProfile(session.user.id);
              setUser({
                id: session.user.id,
                email: session.user.email,
                ...profile,
              });
            } catch (profileError) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name || '',
                last_name: session.user.user_metadata?.last_name || '',
                phone: session.user.user_metadata?.phone || '',
                address: session.user.user_metadata?.address || '',
              });
            }
            setToken(session.access_token);
            setIsAuthenticated(true);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        }
      );
      subscription = sub;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
