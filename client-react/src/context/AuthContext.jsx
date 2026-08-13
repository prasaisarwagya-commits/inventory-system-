// import { createContext, useContext, useState, useCallback } from 'react';
// import * as authApi from '../api/resources';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(() => localStorage.getItem('ims_token'));
//   const [username, setUsername] = useState(() => localStorage.getItem('ims_username'));

//   const register = useCallback(async (usernameInput, password) => {
//     const data = await authApi.register(usernameInput, password);
//     localStorage.setItem('ims_token', data.token);
//     localStorage.setItem('ims_username', data.user.username);
//     setToken(data.token);
//     setUsername(data.user.username);
//     return data;
//   }, []);

//   const login = useCallback(async (usernameInput, password) => {
//     const data = await authApi.login(usernameInput, password);
//     localStorage.setItem('ims_token', data.token);
//     localStorage.setItem('ims_username', data.user.username);
//     setToken(data.token);
//     setUsername(data.user.username);
//     return data;
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem('ims_token');
//     localStorage.removeItem('ims_username');
//     setToken(null);
//     setUsername(null);
//   }, []);

//   const value = {
//     token,
//     username,
//     isAuthenticated: Boolean(token),
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// }


import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/resources';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ims_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('ims_username'));
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('ims_user_id');
    return stored ? Number(stored) : null;
  });
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('ims_is_admin') === 'true');

  function persistSession(data) {
    localStorage.setItem('ims_token', data.token);
    localStorage.setItem('ims_username', data.user.username);
    localStorage.setItem('ims_user_id', String(data.user.id));
    localStorage.setItem('ims_is_admin', String(Boolean(data.user.isAdmin)));
    setToken(data.token);
    setUsername(data.user.username);
    setUserId(data.user.id);
    setIsAdmin(Boolean(data.user.isAdmin));
  }

  const register = useCallback(async (usernameInput, password) => {
    const data = await authApi.register(usernameInput, password);
    persistSession(data);
    return data;
  }, []);

  const login = useCallback(async (usernameInput, password) => {
    const data = await authApi.login(usernameInput, password);
    persistSession(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_username');
    localStorage.removeItem('ims_user_id');
    localStorage.removeItem('ims_is_admin');
    setToken(null);
    setUsername(null);
    setUserId(null);
    setIsAdmin(false);
  }, []);

  const value = { token, username, userId, isAdmin, isAuthenticated: Boolean(token), login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}