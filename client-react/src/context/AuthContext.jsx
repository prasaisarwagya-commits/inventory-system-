import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/resources';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ims_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('ims_username'));

  const register = useCallback(async (usernameInput, password) => {
    const data = await authApi.register(usernameInput, password);
    localStorage.setItem('ims_token', data.token);
    localStorage.setItem('ims_username', data.user.username);
    setToken(data.token);
    setUsername(data.user.username);
    return data;
  }, []);

  const login = useCallback(async (usernameInput, password) => {
    const data = await authApi.login(usernameInput, password);
    localStorage.setItem('ims_token', data.token);
    localStorage.setItem('ims_username', data.user.username);
    setToken(data.token);
    setUsername(data.user.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_username');
    setToken(null);
    setUsername(null);
  }, []);

  const value = {
    token,
    username,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}