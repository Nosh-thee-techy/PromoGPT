import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import Products from './Products.jsx';
import CSVUpload from './CSVUpload.jsx';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  // Replace with your actual business slug logic
  const businessSlug = 'demo-business';

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      <Products businessSlug={businessSlug} />
      <CSVUpload businessSlug={businessSlug} />
    </div>
  );
};

export default Dashboard;
