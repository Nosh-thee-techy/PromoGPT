import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000'; // Change to your backend API base URL

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user data from localStorage to persist login
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('access') || '');

  const [loading, setLoading] = useState(true);

  // Optionally check if token is still valid when app loads
  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        setUser(response.data);
      }).catch(() => {
        logout();
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, { email, password });
      const { access, refresh, user } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(access);
      setUser(user);
      return true;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
