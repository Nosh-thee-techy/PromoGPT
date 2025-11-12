// // src/pages/dashboard/SavedPosts.jsx
// import React from "react";

// const sample = [
//   { id: 1, title: "Launch Week Offer", snippet: "KSh 100 off this week only." },
//   { id: 2, title: "Customer Testimonial", snippet: "Thanks for the great service!" },
// ];

// export default function SavedPosts() {
//   return (
//     <section className="panel">
//       <h2>Saved posts</h2>
//       <p className="muted">Your saved drafts and published posts.</p>

//       <div className="saved-grid">
//         {sample.map((s) => (
//           <article key={s.id} className="card saved-card">
//             <h4>{s.title}</h4>
//             <p>{s.snippet}</p>
//             <div className="saved-card__actions">
//               <button className="btn btn--ghost">Edit</button>
//               <button className="btn btn--primary">Publish</button>
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>

// src/pages/dashboard/SavedPosts.jsx
import React, { useState } from "react";
import { FiCopy, FiTrash2, FiSearch } from "react-icons/fi";

export default function SavedPosts() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, text: "🚀 Boost your brand visibility this week!", tags: ["awareness", "promo"] },
    { id: 2, text: "🎯 Engage your audience with exciting updates.", tags: ["engagement"] },
    { id: 3, text: "💰 Drive sales using exclusive deals.", tags: ["sales", "discount"] },
  ]);

  const filtered = posts.filter((p) =>
    p.text.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">🧠 Saved Posts</h1>

      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-md">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search saved content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700"
        />
      </div>

      {/* Content cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
            <p className="text-gray-800 mb-3">{p.text}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {p.tags.map((t, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
            <div className="flex gap-3 text-sm">
              <button
                onClick={() => navigator.clipboard.writeText(p.text)}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <FiCopy /> Copy
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex items-center gap-1 text-red-600 hover:underline"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
