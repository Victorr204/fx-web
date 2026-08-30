"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error?: string; requireEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateAuth() {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (cancelled) return;
      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.profile?.name,
        });
      }
      setLoading(false);
    }

    void hydrateAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.statusCode === 403) {
        return { error: "Email not verified. Please check your inbox." };
      }
      return { error: error.message };
    }
    if (data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.profile?.name,
      });
    }
    return {};
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { error: error.message };
    if (data?.requireEmailVerification) {
      return { requireEmailVerification: true };
    }
    if (data?.accessToken && data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.profile?.name,
      });
    }
    return {};
  };

  const verifyEmail = async (email: string, otp: string) => {
    const { data, error } = await insforge.auth.verifyEmail({ email, otp });
    if (error) return { error: error.message };
    if (data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.profile?.name,
      });
    }
    return {};
  };

  const resetPassword = async (email: string) => {
    const { error } = await insforge.auth.sendResetPasswordEmail({
      email,
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        verifyEmail,
        resetPassword,
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
