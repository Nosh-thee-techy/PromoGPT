// src/pages/dashboard/BusinessProfile.jsx
import React, { useState } from "react";
import api from "../../api";

export default function BusinessProfile() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Replace with your backend endpoint for profile update
      await api.post("/users/business/create/", form).catch(() => {});
      // successful mock toast
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2>Business profile</h2>
      <p className="muted">Complete your profile so AI writes in your voice.</p>

      <form className="profile-form" onSubmit={save}>
        <label>
          Business name
          <input required value={form.name} onChange={update("name")} />
        </label>

        <label>
          Industry
          <input value={form.industry} onChange={update("industry")} />
        </label>

        <label>
          Location
          <input value={form.location} onChange={update("location")} />
        </label>

        <label>
          Short description
          <textarea value={form.description} onChange={update("description")} rows={4} />
        </label>

        <button className="btn btn--primary" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
      </form>
    </section>
  );
}
