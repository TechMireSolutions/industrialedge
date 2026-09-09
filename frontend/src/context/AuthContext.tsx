import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi, User } from '../services';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await authApi.login({ email, password });
    const user = response.data.user;
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    setUser(user);

    return user;
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authApi.register({ name, email, password, phone });
    const user = response.data.user;
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    setUser(user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    const response = await authApi.updateProfile(data);
    const user = response;

    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}