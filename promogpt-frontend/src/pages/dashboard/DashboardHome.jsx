// src/pages/dashboard/DashboardHome.jsx
import React from "react";

export default function DashboardHome() {
  return (
    <section className="panel">
      <h2>Welcome back 👋</h2>
      <p className="muted">Quick actions and recent activity</p>

      <div className="grid">
        <article className="card">
          <h3>Create a new campaign</h3>
          <p>Generate tailored social captions, SMS, and ads in seconds.</p>
        </article>

        <article className="card">
          <h3>Saved drafts</h3>
          <p>Reuse previous campaigns and iterate quickly.</p>
        </article>

        <article className="card">
          <h3>Business profile</h3>
          <p>Improve AI outputs by completing your profile.</p>
        </article>
      </div>
    </section>
  );
}
