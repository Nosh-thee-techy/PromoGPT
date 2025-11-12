// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFileText, FiUser, FiPackage, FiBarChart2, FiSettings, FiBook } from "react-icons/fi";

export default function Sidebar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/dashboard/campaign", label: "Campaigns", icon: <FiFileText /> },
    { to: "/dashboard/generate", label: "AI Generator", icon: <FiBarChart2 /> },
    { to: "/dashboard/saved", label: "Saved Posts", icon: <FiBook /> },
    { to: "/dashboard/products", label: "Products", icon: <FiPackage /> },
    { to: "/dashboard/ledger", label: "Ledger", icon: <FiBarChart2 /> },
    { to: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
    { to: "/dashboard/support", label: "Support", icon: <FiSettings /> },
  ];

  return (
    <aside className="sidebar bg-gray-900 text-white h-screen p-6 w-64 fixed">
      <div className="text-2xl font-bold mb-8">PromoGPT</div>
      <nav className="space-y-3">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              pathname === to ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
