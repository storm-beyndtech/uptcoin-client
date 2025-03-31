import { User } from '@/types/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(true);
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const location = useLocation();

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const fetchUser = async (userId: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(`${url}/auth/users/${userId}`, {
        signal: controller.signal,
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      clearTimeout(timeoutId);
      setFetching(false);
    }
  };

  // ✅ Silent refresh function (Triggers app-wide updates)
  const refreshUser = async () => {
    if (user) {
      await fetchUser(user._id);
    }
  };

  useEffect(() => {
    setFetching(true);
    const storageData = localStorage.getItem('user');

    if (storageData) {
      const user = JSON.parse(storageData);
      fetchUser(user._id);
    } else {
      setUser(null);
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    const storageData = localStorage.getItem('user');
    if (storageData) {
      const user = JSON.parse(storageData);
      if (location.pathname.includes('/dashboard')) {
        fetchUser(user._id);
      }
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{ user, fetching, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);
export const contextData = useAuthContext;
