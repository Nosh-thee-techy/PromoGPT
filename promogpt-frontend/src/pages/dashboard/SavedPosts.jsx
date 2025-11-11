// src/pages/dashboard/SavedPosts.jsx
import React from "react";

const sample = [
  { id: 1, title: "Launch Week Offer", snippet: "KSh 100 off this week only." },
  { id: 2, title: "Customer Testimonial", snippet: "Thanks for the great service!" },
];

export default function SavedPosts() {
  return (
    <section className="panel">
      <h2>Saved posts</h2>
      <p className="muted">Your saved drafts and published posts.</p>

      <div className="saved-grid">
        {sample.map((s) => (
          <article key={s.id} className="card saved-card">
            <h4>{s.title}</h4>
            <p>{s.snippet}</p>
            <div className="saved-card__actions">
              <button className="btn btn--ghost">Edit</button>
              <button className="btn btn--primary">Publish</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
