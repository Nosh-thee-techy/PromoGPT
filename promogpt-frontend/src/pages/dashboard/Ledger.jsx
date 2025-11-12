// src/pages/dashboard/Ledger.jsx
import React, { useState } from "react";

export default function Ledger() {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    cost: "",
    price: "",
    stock: "",
  });

  const [salesData, setSalesData] = useState({
    date: "",
    product: "",
    quantity: "",
    total: "",
  });

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  // Update handlers
  const updateProduct = (key) => (e) =>
    setProductData((prev) => ({ ...prev, [key]: e.target.value }));

  const updateSale = (key) => (e) =>
    setSalesData((prev) => ({ ...prev, [key]: e.target.value }));

  // Submit handlers
  const addProduct = (e) => {
    e.preventDefault();
    setProducts([...products, productData]);
    setProductData({ name: "", category: "", cost: "", price: "", stock: "" });
  };

  const addSale = (e) => {
    e.preventDefault();
    setSales([...sales, salesData]);
    setSalesData({ date: "", product: "", quantity: "", total: "" });
  };

  return (
    <div className="ledger-page p-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">📊 Business Ledger</h1>

      {/* Product Data Section */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Product Data</h2>
        <form onSubmit={addProduct} className="grid md:grid-cols-5 gap-3">
          <input required placeholder="Product Name" value={productData.name} onChange={updateProduct("name")} className="input" />
          <input required placeholder="Category" value={productData.category} onChange={updateProduct("category")} className="input" />
          <input required type="number" placeholder="Unit Cost" value={productData.cost} onChange={updateProduct("cost")} className="input" />
          <input required type="number" placeholder="Selling Price" value={productData.price} onChange={updateProduct("price")} className="input" />
          <input required type="number" placeholder="Stock" value={productData.stock} onChange={updateProduct("stock")} className="input" />
          <button type="submit" className="btn btn--primary col-span-full mt-2">Add Product</button>
        </form>

        {/* Product Table */}
        <table className="mt-6 w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.cost}</td>
                <td className="p-2">{p.price}</td>
                <td className="p-2">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sales Data Section */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Sales Data</h2>
        <form onSubmit={addSale} className="grid md:grid-cols-4 gap-3">
          <input required type="date" value={salesData.date} onChange={updateSale("date")} className="input" />
          <input required placeholder="Product Sold" value={salesData.product} onChange={updateSale("product")} className="input" />
          <input required type="number" placeholder="Quantity" value={salesData.quantity} onChange={updateSale("quantity")} className="input" />
          <input required type="number" placeholder="Total Sale Value" value={salesData.total} onChange={updateSale("total")} className="input" />
          <button type="submit" className="btn btn--primary col-span-full mt-2">Add Sale</button>
        </form>

        {/* Sales Table */}
        <table className="mt-6 w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{s.date}</td>
                <td className="p-2">{s.product}</td>
                <td className="p-2">{s.quantity}</td>
                <td className="p-2">{s.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
