import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'; // Adjust path if necessary

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, token } = context;

  // Optional helper for roles or permissions
  const isAuthorized = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  return { user, login, logout, token, isAuthorized };
};
