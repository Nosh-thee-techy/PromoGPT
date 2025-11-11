// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Optionally: verify token by requesting /users/me
      ;(async () => {
        try {
          const res = await api.get("/users/me/");
          setUser(res.data);
        } catch (err) {
          // If verification fails, clear
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          delete api.defaults.headers.common.Authorization;
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
