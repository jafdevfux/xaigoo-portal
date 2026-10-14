// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — AuthContext (sessão PHP xaigoo_session via /api/auth/*)

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../services/api';
import * as api from '../services/api';
import type { User } from '../services/api';

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      const u = await api.me();
      setUser(u);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setUser(null);
        return;
      }
      // DB offline ou rede: trata como deslogado sem quebrar, mas mantém null
      // 500 gracioso não derruba; outros erros também viram deslogado
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await api.me();
        if (!cancelled) setUser(u);
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          if (!cancelled) setUser(null);
        } else {
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const u = await api.login({ email, password });
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    const u = await api.register({ name, email, password });
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
