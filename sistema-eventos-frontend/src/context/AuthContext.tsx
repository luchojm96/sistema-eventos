import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth.api";
import type { Usuario } from "../types/auth.types";

interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  registro: (datos: { nombre: string; email: string; password: string; telefono?: string }) => Promise<Usuario>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user } = await authApi.login({ email, password });
    setUser(user);
    return user;
  }

  async function registro(datos: { nombre: string; email: string; password: string; telefono?: string }) {
    const { user } = await authApi.registro(datos);
    setUser(user);
    return user;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registro, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}
