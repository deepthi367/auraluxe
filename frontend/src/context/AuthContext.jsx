import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auraluxe_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    const hydrate = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser((prev) => {
          const next = { ...data, token: prev.token };
          localStorage.setItem('auraluxe_user', JSON.stringify(next));
          return next;
        });
      } catch {
        localStorage.removeItem('auraluxe_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (payload) => {
    localStorage.setItem('auraluxe_user', JSON.stringify(payload));
    if (payload?.token) localStorage.setItem('auraluxe_token', payload.token);
    setUser(payload);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('auraluxe_user');
    localStorage.removeItem('auraluxe_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    persist({ ...data, token: user.token });
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser, persist }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
