// src/pages/dashboard/Products.jsx
import React, { useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const update = (key) => (e) =>
    setNewProduct((p) => ({ ...p, [key]: e.target.value }));

  const addProduct = (e) => {
    e.preventDefault();
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", price: "", stock: "", category: "" });
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">🛍️ Product Management</h1>
      <form onSubmit={addProduct} className="grid md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-md">
        <input required placeholder="Name" value={newProduct.name} onChange={update("name")} className="input" />
        <input required placeholder="Category" value={newProduct.category} onChange={update("category")} className="input" />
        <input required type="number" placeholder="Price" value={newProduct.price} onChange={update("price")} className="input" />
        <input required type="number" placeholder="Stock" value={newProduct.stock} onChange={update("stock")} className="input" />
        <button className="btn btn--primary col-span-full">Add Product</button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
