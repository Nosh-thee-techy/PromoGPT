// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className={`dashboard__content ${collapsed ? "expanded" : ""}`}>
        <div className="dashboard__topbar">
          <h3>Workspace</h3>
        </div>

        <main className="dashboard__main">
          {/* Nested routes render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
