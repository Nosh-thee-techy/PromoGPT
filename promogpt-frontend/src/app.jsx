// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

import DashboardHome from "./pages/dashboard/DashboardHome";
import Campaign from "./pages/dashboard/Campaign";
import CreateContent from "./pages/dashboard/CreateContent";
import SavedPosts from "./pages/dashboard/SavedPosts";
import Products from "./pages/dashboard/Products";
import Ledger from "./pages/dashboard/Ledger";
import BusinessProfile from "./pages/dashboard/BusinessProfile";
import Support from "./pages/dashboard/Support";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/campaign" element={<Campaign />} />
          <Route path="/dashboard/generate" element={<CreateContent />} />
          <Route path="/dashboard/saved" element={<SavedPosts />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/ledger" element={<Ledger />} />
          <Route path="/dashboard/profile" element={<BusinessProfile />} />
          <Route path="/dashboard/support" element={<Support />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
