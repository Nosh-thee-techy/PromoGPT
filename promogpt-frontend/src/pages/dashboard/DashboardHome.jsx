// src/pages/dashboard/DashboardHome.jsx
import React, { useState, useEffect } from "react";
import { FiPlusCircle, FiTrendingUp, FiShoppingBag, FiFileText, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardHome() {
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({
    campaigns: 5,
    posts: 32,
    products: 8,
    sales: 2400,
  });

  // Dummy sales trend data
  const salesData = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 600 },
    { month: "Mar", sales: 800 },
    { month: "Apr", sales: 700 },
    { month: "May", sales: 1000 },
    { month: "Jun", sales: 1200 },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.first_name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👋 Welcome back, {userName}!</h1>
          <p className="text-gray-500 mt-1">Here’s what’s happening with your business today.</p>
        </div>
        <Link
          to="/dashboard/campaign"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          <FiPlusCircle /> Start New Campaign
        </Link>
      </header>

      {/* Stats Section */}
      <section className="grid md:grid-cols-4 gap-6">
        <StatCard icon={<FiFileText />} label="Active Campaigns" value={stats.campaigns} color="bg-blue-100 text-blue-800" />
        <StatCard icon={<FiZap />} label="Generated Posts" value={stats.posts} color="bg-green-100 text-green-800" />
        <StatCard icon={<FiShoppingBag />} label="Products" value={stats.products} color="bg-purple-100 text-purple-800" />
        <StatCard icon={<FiTrendingUp />} label="Monthly Sales (Ksh)" value={`Ksh ${stats.sales}`} color="bg-yellow-100 text-yellow-800" />
      </section>

      {/* Sales Trend Chart */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Sales Trend (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">⚡ Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <QuickAction
            label="Add Product"
            desc="Expand your catalog"
            to="/dashboard/products"
            icon={<FiShoppingBag />}
          />
          <QuickAction
            label="Record Sale"
            desc="Update your ledger"
            to="/dashboard/ledger"
            icon={<FiTrendingUp />}
          />
          <QuickAction
            label="Generate Post"
            desc="Create AI promo content"
            to="/dashboard/generate"
            icon={<FiZap />}
          />
          <QuickAction
            label="View History"
            desc="See saved posts"
            to="/dashboard/saved"
            icon={<FiFileText />}
          />
        </div>
      </section>

      {/* AI Suggestion */}
      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">💡 AI Insight</h2>
        <p className="text-blue-600">
          Your product <strong>“Summer Glow Kit”</strong> had a 20% sales increase last month.  
          Try promoting it again with a limited-time discount campaign!
        </p>
      </section>
    </div>
  );
}

// Reusable StatCard component
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-5 rounded-2xl shadow-sm bg-white hover:shadow-lg transition border-l-4 ${color.split(" ")[0]}`}>
      <div className={`flex items-center justify-between mb-2 ${color.split(" ")[1]}`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{label}</h3>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// Reusable QuickAction card
function QuickAction({ label, desc, to, icon }) {
  return (
    <Link
      to={to}
      className="flex flex-col justify-between bg-gray-50 hover:bg-gray-100 border rounded-2xl p-4 transition shadow-sm"
    >
      <div className="text-2xl text-blue-600 mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-800">{label}</h4>
      <p className="text-gray-500 text-sm">{desc}</p>
    </Link>
  );
}
