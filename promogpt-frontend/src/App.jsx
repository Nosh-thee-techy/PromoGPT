import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Setup backend base URL - update to your backend URL or env variable
const API_BASE = 'http://localhost:8000';

// Auth Context to manage login state & tokens
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access') || '');

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/users/login`, { email, password });
      const { access, refresh, user } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setToken(access);
      setUser(user);
    } catch (err) {
      alert('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login form
const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => login(email, password)}>Login</button>
    </div>
  );
};

// Product List component
const Products = ({ businessSlug }) => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessSlug) return;
    setLoading(true);
    axios.get(`${API_BASE}/business/${businessSlug}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => {
      alert('Failed to fetch products');
      setLoading(false);
    });
  }, [businessSlug, token]);

  if (loading) return <p>Loading products...</p>;
  if (!products.length) return <p>No products found</p>;

  return (
    <div>
      <h3>Products</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - {p.price}</li>
        ))}
      </ul>
    </div>
  );
};

// CSV Upload component
const CSVUpload = ({ businessSlug }) => {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const upload = () => {
    if (!file) return alert('Select a CSV file first');
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`${API_BASE}/business/${businessSlug}/product-upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      alert('Upload successful');
      setFile(null);
    }).catch(() => {
      alert('Upload failed');
    });
  };

  return (
    <div>
      <h3>Upload Products CSV</h3>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
};

// Main App component
export default function App() {
  const { user, logout } = useContext(AuthContext);
  // Replace with actual business slug management from your data
  const businessSlug = 'demo-business'; 

  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <LoginForm />
      ) : (
        <>
          <h1>Welcome, {user.email}</h1>
          <button onClick={logout}>Logout</button>
          <Products businessSlug={businessSlug} />
          <CSVUpload businessSlug={businessSlug} />
        </>
      )}
    </div>
  );
}

// Wrap app with AuthProvider in entrypoint (index.jsx)
