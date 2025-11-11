// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import BrandMark from "../components/BrandMark";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/users/login/", { email, password });
      const user = res.data.user || res.data;
      const access = res.data.access || res.data.token || res.data.access_token;
      login(user, access);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BrandMark size="lg" stacked />
        <h2>Welcome back</h2>
        {error && <div className="alert alert--error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p>Don't have an account? <button className="link-button" onClick={() => navigate("/signup")}>Sign up</button></p>
      </div>
    </div>
  );
}
