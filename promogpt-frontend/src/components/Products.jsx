import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';

const API_BASE = 'http://localhost:8000';

const Products = ({ businessSlug }) => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessSlug) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/business/${businessSlug}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch products');
        setLoading(false);
      });
  }, [businessSlug, token]);

  if (loading) return <p>Loading products...</p>;
  if (products.length === 0) return <p>No products found</p>;

  return (
    <div>
      <h3>Products</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
