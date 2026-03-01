import { createContext } from "react";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  alias?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
