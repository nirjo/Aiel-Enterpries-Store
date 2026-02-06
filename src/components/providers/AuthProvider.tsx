"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  signInWithGoogle as signInWithGoogleFn,
  signOut as signOutFn,
  getProfile,
  syncGoogleProfile,
} from "@/lib/auth";
import type { Profile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch profile for user
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // First try to get existing profile
      let profileData = await getProfile(userId);
      
      // If profile exists but missing Google data, sync it
      if (profileData && (!profileData.avatar_url || !profileData.full_name)) {
        profileData = await syncGoogleProfile(userId);
      }
      
      setProfile(profileData);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setError(err instanceof Error ? err : new Error("Auth initialization failed"));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === "SIGNED_IN" && newSession?.user) {
          // Sync Google profile data after sign in
          await fetchProfile(newSession.user.id);
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Sign in with Google
  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      setError(null);
      await signInWithGoogleFn(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign in failed"));
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await signOutFn();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign out failed"));
      throw err;
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        error,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
