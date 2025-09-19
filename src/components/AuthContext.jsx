import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info.jsx';

const AuthContext = createContext(undefined);

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      console.log('Refreshing user data...');
      
      // Check for stored user session first
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        try {
          const sessionData = JSON.parse(userSession);
          if (sessionData.token === 'demo-admin-token' || sessionData.token === 'demo-teacher-token') {
            // For demo token, get user data directly
            const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/get-user-by-token`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ token: sessionData.token })
            });
            
            if (response.ok) {
              const { user: userData } = await response.json();
              console.log('User data refreshed from demo token:', userData);
              setUser(userData);
              return;
            }
          }
        } catch (e) {
          console.log('Error parsing stored user session:', e);
        }
      }
      
      // Check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        console.log('Found Supabase session, fetching user data');
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/user`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const { user: userData } = await response.json();
          console.log('User data refreshed from Supabase:', userData);
          setUser(userData);
        } else {
          console.log('Failed to fetch user data:', response.status);
        }
      } else {
        console.log('No valid session found');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for student session first
        const studentSession = localStorage.getItem('studentSession');
        if (studentSession) {
          try {
            const studentUser = JSON.parse(studentSession);
            setUser(studentUser);
            setLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem('studentSession');
          }
        }

        // Check for user session
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
          try {
            const sessionData = JSON.parse(userSession);
            setUser(sessionData.user);
            setLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem('userSession');
          }
        }

        // Check for regular Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        await refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('studentSession');
        localStorage.removeItem('userSession');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, projectId });
      
      // Try simple login first (for demo)
      const loginUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/simple-login`;
      console.log('Login URL:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login success:', data);
        setUser(data.user);
        // Store session for persistence
        localStorage.setItem('userSession', JSON.stringify({ user: data.user, token: data.token }));
        return { success: true };
      }

      // Get error details
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.log('Simple login failed with error:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }

      // Fall back to Supabase auth only if it's not a credential error
      if (response.status !== 401) {
        console.log('Falling back to Supabase auth');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Supabase login error:', error.message);
          return { success: false, error: error.message };
        }

        if (data.session?.access_token) {
          await refreshUser();
          return { success: true };
        }
      }

      return { success: false, error: errorMessage };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please check your connection and try again.' };
    }
  };

  const loginStudent = async (studentId) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/login-student`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Student login failed' };
      }

      // For student login, we'll set the user directly since we're using ID-based auth
      setUser(data.user);
      
      // Store student session in localStorage for persistence
      localStorage.setItem('studentSession', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      console.error('Student login error:', error);
      return { success: false, error: 'Student login failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('studentSession');
      localStorage.removeItem('userSession');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginStudent, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}