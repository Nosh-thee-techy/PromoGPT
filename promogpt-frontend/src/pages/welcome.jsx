// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <main className="page page--gradient">
      <header className="navbar">
        <BrandMark size="sm" />
        <div className="navbar__actions">
          <button className="btn btn--ghost" onClick={() => navigate("/login")}>Login</button>
          <button className="btn btn--primary" onClick={() => navigate("/signup")}>Get started</button>
        </div>
      </header>

      <section className="hero hero--center">
        <div className="hero__badge">Built for Kenyan SMEs</div>
        <h1 className="hero__title">AI marketing that feels tailor-made for your business</h1>
        <p className="hero__subtitle">Upload your data and PromoGPT will craft campaigns, content and ad copy.</p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={() => navigate("/signup")}>Create a free account</button>
          <button className="btn btn--ghost" onClick={() => navigate("/demo")}>View demo</button>
        </div>
      </section>
    </main>
  );
}
