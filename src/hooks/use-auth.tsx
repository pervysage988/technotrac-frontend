"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string, role: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Restore user from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Call backend: request OTP
  const requestOtp = async (phone: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_e164: phone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to request OTP");
    }
  };

  // Call backend: verify OTP
  const verifyOtp = async (phone: string, code: string, role: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_e164: phone, code, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to verify OTP");
    }

    const data = await res.json();
    setToken(data.access_token);
    setUser(data.user);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/dashboard");
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const value: AuthContextType = { user, token, requestOtp, verifyOtp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
