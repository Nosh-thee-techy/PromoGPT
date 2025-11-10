import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';
import LoginForm from './components/LoginForm.jsx';
import Products from './components/Products.jsx';
import CSVUpload from './components/CSVUpload.jsx';

const API_BASE = '.';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access') || '');

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, { email, password });
      const { access, refresh, user: u } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setToken(access);
      setUser(u);
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
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

const AppMain = () => {
  const { user, logout } = useContext(AuthContext);
  const businessSlug = 'demo-business';

  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <LoginForm />
      ) : (
        <>
          <h1>Welcome, {user.email}</h1>
          <button onClick={logout}>Logout</button>
          <Products businessSlug={businessSlug} />
          <CSVUpload businessSlug={businessSlug} />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppMain />
    </AuthProvider>
  );
}