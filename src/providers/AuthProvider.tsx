"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "@/contexts/AuthContext";

const TOKEN_KEY = "flexpay-token";
const USER_KEY  = "flexpay-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser]   = useState<AuthUser | null>(null);

  // Hydrate from localStorage after mount so the initial render matches the server (null)
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUser)  setUser(JSON.parse(storedUser) as AuthUser);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
