// src/components/BusinessCreationForm.jsx
import React, { useState } from "react";
import api from "../api";

export default function BusinessCreationForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", industry: "", location: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/users/business/create/", form);
      setForm({ name: "", industry: "", location: "" });
      onCreated?.();
    } catch (err) {
      setError("Unable to save business. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="business-form" onSubmit={submit}>
      <h4>Add a business</h4>
      {error && <div className="alert alert--error">{error}</div>}
      <input required placeholder="Business name" value={form.name} onChange={update("name")} />
      <input required placeholder="Industry" value={form.industry} onChange={update("industry")} />
      <input placeholder="Primary location" value={form.location} onChange={update("location")} />
      <button className="btn btn--primary" type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save business"}</button>
    </form>
  );
}
