import React, { createContext, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access') || '');

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, { email, password });
      const { access, refresh, user } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setToken(access);
      setUser(user);
    } catch (err) {
      alert('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
