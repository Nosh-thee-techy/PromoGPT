import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Configure axios defaults
axios.defaults.baseURL = API_BASE;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token validity
      const verifyToken = async () => {
        try {
          // You can add a /users/me endpoint to verify token
          setLoading(false);
        } catch (error) {
          logout();
          setLoading(false);
        }
      };
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Welcome/Landing Page
const WelcomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🦁</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            PromoGPT
          </span>
        </div>
        <button onClick={() => onNavigate('login')} className="btn-secondary">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
            🇰🇪 Built for Kenyan SMEs
          </span>
        </div>
        
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent animate-slide-up">
          AI-Powered Marketing
          <br />
          for Your Business
        </h1>
        
        <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
          Upload your data, get instant marketing campaigns, social media posts, and ad copy
          tailored for the Kenyan market.
        </p>

        <button onClick={() => onNavigate('signup')} className="btn-primary text-xl">
          Get Started Free →
        </button>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            { emoji: '📊', title: 'Upload Your Data', desc: 'CSV files with sales, inventory, and customer data' },
            { emoji: '🤖', title: 'AI Analysis', desc: 'Smart insights tailored for the Kenyan market' },
            { emoji: '🚀', title: 'Launch Campaigns', desc: 'Ready-to-use content for social media and ads' }
          ].map((feature, idx) => (
            <div key={idx} className="card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Signup Page
const SignupPage = ({ onBack }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'owner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/users/register/', formData);
      login(response.data.user, response.data.access);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.email?.[0] || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-3xl">🦁</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            PromoGPT
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">Start growing your business today</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="+254 700 000 000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => onBack('login')} className="text-orange-600 hover:text-orange-700 font-medium">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = ({ onBack }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/users/login/', { email, password });
      login(response.data.user, response.data.access);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-3xl">🦁</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            PromoGPT
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Login to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button onClick={() => onBack('signup')} className="text-orange-600 hover:text-orange-700 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🦁</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              PromoGPT
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-gray-800">{user?.first_name}</span>
            </span>
            <button onClick={logout} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {[
            { id: 'upload', icon: '📤', label: 'Upload Data' },
            { id: 'campaigns', icon: '🚀', label: 'Campaigns' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'upload' && <UploadSection />}
        {activeTab === 'campaigns' && <CampaignsSection />}
      </main>
    </div>
  );
};

// Upload Section
const UploadSection = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('/business/demo-business/products/upload/', formData);
      setMessage({ type: 'success', text: 'Upload successful! Your data is being processed.' });
      setFile(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Business Data</h2>
      <p className="text-gray-600 mb-6">Upload CSV files with your sales, inventory, or customer data</p>

      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-400 transition">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          {file ? (
            <div>
              <div className="text-5xl mb-4">✅</div>
              <p className="font-medium text-orange-600">{file.name}</p>
              <p className="text-sm text-gray-500 mt-2">Click to change file</p>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4">📄</div>
              <p className="font-medium text-gray-700">Click to select CSV file</p>
              <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
            </div>
          )}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </div>
  );
};

// Campaigns Section
const CampaignsSection = () => {
  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Campaigns</h2>
      <p className="text-gray-600 mb-6">AI-generated marketing campaigns will appear here</p>
      
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚀</div>
        <p className="text-gray-500">Upload your data to generate campaigns</p>
        <p className="text-sm text-gray-400 mt-2">AI campaign generation coming soon!</p>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [page, setPage] = useState('welcome');

  return (
    <AuthProvider>
      <AppRouter page={page} setPage={setPage} />
    </AuthProvider>
  );
}

// Router Component
const AppRouter = ({ page, setPage }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🦁</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Auto-redirect to dashboard if logged in
  if (user && page !== 'dashboard') {
    setPage('dashboard');
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      {page === 'welcome' && <WelcomePage onNavigate={setPage} />}
      {page === 'signup' && <SignupPage onBack={setPage} />}
      {page === 'login' && <LoginPage onBack={setPage} />}
    </>
  );
};