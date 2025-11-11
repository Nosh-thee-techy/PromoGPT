// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BrandMark size="lg" stacked />
        
        <h2>Welcome to PromoGPT ✨</h2>
        <p style={{ textAlign: "center", maxWidth: "300px" }}>
          Create promotional content for your small business — fast, smart, and professional.
        </p>

        <div className="home-actions">
          <button className="btn btn--primary" onClick={() => navigate("/signup")}>
            Get Started
          </button>
          <button className="btn btn--secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
