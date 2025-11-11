import React from "react";
import Navbar from "../components/Navbar";
import BrandMark from "../components/BrandMark";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <header className="hero">
        <div className="hero__content">
          <BrandMark size="lg" stacked />
          <h1>Promote Smarter. Grow Faster.</h1>
          <p>
            AI-powered marketing content designed to help your business rise above the competition.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => navigate("/signup")}>
              Create Account
            </button>
            <button className="btn btn--secondary" onClick={() => navigate("/dashboard")}>
              Try Demo
            </button>
          </div>
        </div>
      </header>

      <section className="section features">
        <h2>Why PromoGPT?</h2>
        <div className="features__grid">
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Instant Content</h3>
            <p>Generate marketing posts and campaigns in seconds.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📈</span>
            <h3>Business Growth</h3>
            <p>Boost your brand visibility with AI-driven strategy.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>Powered by AI</h3>
            <p>Smart prompts and automation tailored for SMEs.</p>
          </div>
        </div>
      </section>

      <section className="section how-it-works">
        <h2>How It Works</h2>
        <ol className="steps">
          <li>Sign up & set your business profile</li>
          <li>Choose content or promotion type</li>
          <li>AI generates customized marketing content</li>
          <li>Publish & watch your business grow</li>
        </ol>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} PromoGPT — Built with ❤️ in Kenya 🇰🇪</p>
      </footer>
    </>
  );
}
