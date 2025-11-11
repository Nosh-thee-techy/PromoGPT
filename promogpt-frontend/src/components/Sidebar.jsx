// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiZap, FiSave, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import BrandMark from "./BrandMark";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ collapsed, onToggle }) {
  const { logout } = useAuth();

  const links = [
    { to: "/dashboard", label: "Home", icon: <FiHome /> },
    { to: "/dashboard/create", label: "Create", icon: <FiZap /> },
    { to: "/dashboard/saved", label: "Saved", icon: <FiSave /> },
    { to: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <BrandMark size="sm" />
        </div>
        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle menu">
          <FiMenu />
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) => `sidebar__link ${isActive ? "is-active" : ""}`}
            title={l.label}
          >
            <span className="sidebar__icon">{l.icon}</span>
            {!collapsed && <span className="sidebar__label">{l.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <button className="sidebar__logout" onClick={logout}>
          <span className="sidebar__icon"><FiLogOut /></span>
          {!collapsed && <span className="sidebar__label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
