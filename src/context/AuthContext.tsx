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
        // Detectar se a página foi recarregada (F5, atualizar)
        const navEntries = performance.getEntriesByType('navigation');
        const isReload = navEntries.length > 0 && (navEntries[0] as any).type === 'reload';

        if (isReload) {
          // Recarga: deslogar por segurança
          try { await api.logout(); } catch { /* ignora */ }
          if (!cancelled) setUser(null);
          setLoading(false);
          return;
        }

        // Não é recarga: verificar marca de sessão ativa (login manual)
        const isActiveSession = sessionStorage.getItem('xaigoo_active');
        if (!isActiveSession) {
          try { await api.logout(); } catch { /* ignora */ }
          if (!cancelled) setUser(null);
          return;
        }

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

    // Heartbeat periódico: renova a marca de "online" no servidor (TTL 60s)
    const heartbeat = setInterval(() => {
      if (cancelled) return;
      if (!sessionStorage.getItem('xaigoo_active')) return;
      api.me().then((u) => { if (!cancelled && u) setUser(u); }).catch(() => {});
    }, 30_000);

    return () => {
      cancelled = true;
      clearInterval(heartbeat);
    };
  }, [refresh]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const u = await api.login({ email, password });
    sessionStorage.setItem('xaigoo_active', '1');
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    const u = await api.register({ name, email, password });
    sessionStorage.setItem('xaigoo_active', '1');
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.logout();
    } finally {
      sessionStorage.removeItem('xaigoo_active');
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
