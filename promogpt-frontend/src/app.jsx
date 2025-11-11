import React, { useState, createContext, useContext, useEffect } from 'react';
import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Configure axios defaults
axios.defaults.baseURL = API_BASE;

// Auth Context
const PAGES = [
  { id: 'welcome', title: 'Welcome', summary: 'Public landing page with the hero experience.', requiresAuth: false },
  { id: 'signup', title: 'Sign up', summary: 'Account creation for business owners and teams.', requiresAuth: false },
  { id: 'login', title: 'Log in', summary: 'Secure access for existing customers.', requiresAuth: false },
  { id: 'demo', title: 'Demo', summary: 'Guided dashboard tour with mock insights.', requiresAuth: false },
  { id: 'dashboard', title: 'Dashboard', summary: 'Authenticated workspace for uploads and campaigns.', requiresAuth: true }
];

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
const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (Array.isArray(error)) {
    return error[0] || fallback;
  }

  const firstKey = Object.keys(error)[0];
  if (!firstKey) {
    return fallback;
  }

  const value = error[firstKey];
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  return fallback;
};

const BrandMark = ({ size = 'md', centered = false, stacked = false }) => (
  <div
    className={[
      'brand-mark',
      `brand-mark--${size}`,
      centered ? 'brand-mark--center' : '',
      stacked ? 'brand-mark--stacked' : ''
    ].join(' ').trim()}
  >
    <span className="brand-mark__icon" role="img" aria-label="PromoGPT logo">
      🦁
    </span>
    <span className="brand-mark__text">PromoGPT</span>
  </div>
);

const WelcomePage = ({ onNavigate }) => {
  const pageCount = PAGES.length;

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
    <div className="page page--gradient">
      <header className="navbar">
        <BrandMark size="sm" />
        <div className="navbar__actions">
          <button type="button" onClick={() => onNavigate('login')} className="btn btn--ghost">
            Login
          </button>
          <button type="button" onClick={() => onNavigate('signup')} className="btn btn--primary">
            Get started
          </button>
        </div>
        <button onClick={() => onNavigate('login')} className="btn-secondary">
          Login
        </button>
      </nav>
      </header>

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
      <main className="hero hero--center">
        <div className="hero__badge">🇰🇪 Built for Kenyan SMEs</div>
        <h1 className="hero__title">
          AI marketing that feels tailor-made for your business
        </h1>
        
        <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
          Upload your data, get instant marketing campaigns, social media posts, and ad copy
          tailored for the Kenyan market.
        <p className="hero__subtitle">
          Upload your data and PromoGPT will craft campaigns, social content, and copy inspired by Kenyan buying habits across Nairobi,
          Lagos, and beyond. Impress customers in minutes, not months.
        </p>

        <button onClick={() => onNavigate('signup')} className="btn-primary text-xl">
          Get Started Free →
        </button>
        <div className="hero__actions">
          <button type="button" onClick={() => onNavigate('signup')} className="btn btn--primary btn--lg">
            Create a free account
          </button>
          <button type="button" onClick={() => onNavigate('demo')} className="btn btn--ghost btn--lg">
            View dashboard demo
          </button>
        </div>

        <ul className="hero__stats">
          <li>
            <span className="hero__stat-value">{pageCount}</span>
            <span className="hero__stat-label">Pages in the app</span>
          </li>
          <li>
            <span className="hero__stat-value">10+</span>
            <span className="hero__stat-label">Content formats</span>
          </li>
          <li>
            <span className="hero__stat-value">100%</span>
            <span className="hero__stat-label">Localized insights</span>
          </li>
        </ul>

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
        <section className="feature-grid" aria-label="Platform capabilities">
          {[{
            icon: '📊',
            title: 'Upload your source data',
            description: 'Bring sales, inventory, or customer CSV files. We clean and profile your data automatically.'
          }, {
            icon: '🤖',
            title: 'Generate ideas instantly',
            description: 'Receive campaign ideas grounded in East and West African trends, complete with copy, visuals, and CTAs.'
          }, {
            icon: '🚀',
            title: 'Launch across channels',
            description: 'Export ready-to-post social captions, email drafts, SMS nudges, and digital ad sets.'
          }].map(({ icon, title, description }) => (
            <article key={title} className="feature-card">
              <div className="feature-card__icon" aria-hidden="true">{icon}</div>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__description">{description}</p>
            </article>
          ))}
        </div>
      </div>
        </section>
      </main>

      <PlatformMap onNavigate={onNavigate} />
      <AfricanMomentum />
      <DataPromise />
      <SolutionsShowcase />
      <FooterCTA onNavigate={onNavigate} />
    </div>
  );
};

// Signup Page
const PlatformMap = ({ onNavigate }) => (
  <section className="section section--light" aria-label="Platform map">
    <div className="section__header">
      <h2 className="section__title">Everything you need is four clicks away</h2>
      <p className="section__subtitle">Every button below routes to a working view so you always know what happens next.</p>
    </div>
    <div className="page-map">
      {PAGES.map((page) => (
        <article key={page.id} className="page-map__card">
          <header className="page-map__header">
            <span className="page-map__tag">{page.title}</span>
            <span className="page-map__indicator" aria-hidden="true">•</span>
          </header>
          <p className="page-map__summary">{page.summary}</p>
          <button
            type="button"
            className="link-button link-button--cta"
            onClick={() => onNavigate(page.requiresAuth ? 'login' : page.id)}
          >
            {page.requiresAuth ? 'Login to open dashboard' : `Go to ${page.title}`}
          </button>
        </article>
      ))}
    </div>
  </section>
);

const AfricanMomentum = () => (
  <section className="section" aria-label="African market focus">
    <div className="section__header">
      <h2 className="section__title">Designed for African growth stories</h2>
      <p className="section__subtitle">
        PromoGPT understands county-level spending patterns in Kenya, seasonal demand in Ghana, and the digital hustle of Nigerian SMEs.
      </p>
    </div>
    <div className="momentum-grid">
      {[{
        title: 'Kenya',
        body: 'Turn M-PESA receipts and Jumia exports into launch-ready social, SMS, and radio concepts.'
      }, {
        title: 'Nigeria',
        body: 'Use Lagos storefront data to craft WhatsApp drip campaigns tuned to Gen Z slang and market days.'
      }, {
        title: 'South Africa',
        body: 'Blend POS exports with township activations for omnichannel promotions that feel hyper-local.'
      }].map(({ title, body }) => (
        <article key={title} className="momentum-card">
          <h3 className="momentum-card__title">{title}</h3>
          <p className="momentum-card__body">{body}</p>
        </article>
      ))}
    </div>
  </section>
);

const DataPromise = () => (
  <section className="section section--muted" aria-label="Data promise">
    <div className="section__header">
      <h2 className="section__title">Where does your data go?</h2>
      <p className="section__subtitle">
        We process every CSV through a secure Django API. Clean records are saved as structured products and sales entries so the AI agent can generate localized campaigns responsibly.
      </p>
    </div>
    <div className="data-promise">
      {[{
        label: 'Raw intake',
        description: 'Files land in RawProductRecord or RawSalesRecord tables for validation and traceability.'
      }, {
        label: 'Business vault',
        description: 'Clean data is scoped to your Business in PostgreSQL. No data mixing across accounts.'
      }, {
        label: 'AI agent',
        description: 'CampaignGenerator reads approved products and sales to craft multi-channel ideas in seconds.'
      }].map(({ label, description }) => (
        <article key={label} className="data-promise__item">
          <h3 className="data-promise__label">{label}</h3>
          <p className="data-promise__description">{description}</p>
        </article>
      ))}
    </div>
  </section>
);

const SolutionsShowcase = () => (
  <section className="section" aria-label="Solutions showcase">
    <div className="section__header">
      <h2 className="section__title">What PromoGPT delivers after you log in</h2>
      <p className="section__subtitle">Our agent summarises your business story and spins up content tuned for African audiences.</p>
    </div>
    <div className="solutions-grid">
      {[{
        icon: '🧭',
        title: 'Actionable brief',
        body: 'A goal-based campaign summary in plain English with Kenyan Shilling budgeting.'
      }, {
        icon: '📱',
        title: 'Channel packs',
        body: 'Ready-to-share captions for Instagram, Twitter, Facebook, WhatsApp, and SMS bursts.'
      }, {
        icon: '📅',
        title: 'Campaign calendar',
        body: 'Week-by-week launch roadmap that aligns with local events, pay days, and public holidays.'
      }, {
        icon: '📈',
        title: 'Insight loops',
        body: 'Highlight reels of top-selling products, category mixes, and upsell suggestions.'
      }].map(({ icon, title, body }) => (
        <article key={title} className="solutions-card">
          <div className="solutions-card__icon" aria-hidden="true">{icon}</div>
          <h3 className="solutions-card__title">{title}</h3>
          <p className="solutions-card__body">{body}</p>
        </article>
      ))}
    </div>
  </section>
);

const FooterCTA = ({ onNavigate }) => (
  <footer className="footer-cta">
    <div className="footer-cta__content">
      <h2 className="footer-cta__title">Ready to see PromoGPT work for your business?</h2>
      <p className="footer-cta__subtitle">Join thousands of African founders translating spreadsheets into storytelling that converts.</p>
    </div>
    <div className="footer-cta__actions">
      <button type="button" className="btn btn--primary btn--lg" onClick={() => onNavigate('signup')}>
        Create your account
      </button>
      <button type="button" className="btn btn--ghost btn--lg" onClick={() => onNavigate('login')}>
        I already have access
      </button>
    </div>
  </footer>
);

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
  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <div className="page page--gradient page--centered">
      <div className="auth-card">
        <BrandMark size="lg" centered stacked />
        <h2 className="auth-card__title">Create your PromoGPT account</h2>
        <p className="auth-card__subtitle">Start translating your data into brilliant marketing moments.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="alert alert--error" role="alert">
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
        <form onSubmit={handleSubmit} className="form">
          <div className="form__row">
            <label className="form__group">
              <span className="form__label">First name</span>
              <input type="text" value={formData.first_name} onChange={updateField('first_name')} className="form__input" required />
            </label>
            <label className="form__group">
              <span className="form__label">Last name</span>
              <input type="text" value={formData.last_name} onChange={updateField('last_name')} className="form__input" required />
            </label>
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
          <label className="form__group">
            <span className="form__label">Work email</span>
            <input type="email" value={formData.email} onChange={updateField('email')} className="form__input" placeholder="you@example.com" required />
          </label>

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
          <label className="form__group">
            <span className="form__label">Phone number</span>
            <input type="tel" value={formData.phone} onChange={updateField('phone')} className="form__input" placeholder="+254 700 000 000" required />
          </label>

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
          <label className="form__group">
            <span className="form__label">Password</span>
            <input type="password" value={formData.password} onChange={updateField('password')} className="form__input" placeholder="••••••••" minLength={8} required />
            <span className="form__hint">Minimum 8 characters</span>
          </label>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          <button type="submit" disabled={loading} className="btn btn--primary btn--block" aria-live="polite">
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => onBack('login')} className="text-orange-600 hover:text-orange-700 font-medium">
        <p className="auth-card__footer">
          Already have an account?
          <button type="button" onClick={() => onBack('login')} className="link-button">
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
  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <div className="page page--gradient page--centered">
      <div className="auth-card">
        <BrandMark size="lg" centered stacked />
        <h2 className="auth-card__title">Welcome back</h2>
        <p className="auth-card__subtitle">Log in to continue crafting local-first campaigns.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="alert alert--error" role="alert">
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
        <form onSubmit={handleSubmit} className="form">
          <label className="form__group">
            <span className="form__label">Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="form__input" placeholder="you@example.com" required />
          </label>

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
          <label className="form__group">
            <span className="form__label">Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="form__input" placeholder="••••••••" required />
          </label>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          <button type="submit" disabled={loading} className="btn btn--primary btn--block" aria-live="polite">
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button onClick={() => onBack('signup')} className="text-orange-600 hover:text-orange-700 font-medium">
        <p className="auth-card__footer">
          Don't have an account?
          <button type="button" onClick={() => onBack('signup')} className="link-button">
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
  const [businesses, setBusinesses] = useState([]);
  const [businessMessage, setBusinessMessage] = useState('Loading business profiles…');
  const [businessesLoading, setBusinessesLoading] = useState(true);
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState('');
  const [campaignRefreshKey, setCampaignRefreshKey] = useState(0);

  const fetchBusinesses = useCallback(async () => {
    setBusinessesLoading(true);
    try {
      const response = await axios.get('/users/business/');
      const data = response.data || [];
      setBusinesses(data);

      if (data.length) {
        setBusinessMessage('');
        setSelectedBusinessSlug((previousSlug) => {
          if (previousSlug && data.some((business) => business.slug === previousSlug)) {
            return previousSlug;
          }
          return data[0].slug;
        });
      } else {
        setBusinessMessage('Add your first business profile to unlock personalized campaigns.');
        setSelectedBusinessSlug('');
      }
    } catch (error) {
      setBusinessMessage('We could not load your businesses. Please refresh or check your permissions.');
      setSelectedBusinessSlug('');
    } finally {
      setBusinessesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleBusinessCreated = (business) => {
    if (!business) {
      return;
    }

    setBusinesses((previous) => {
      const filtered = previous.filter((entry) => entry.id !== business.id);
      return [business, ...filtered];
    });
    setBusinessMessage('');
    setSelectedBusinessSlug(business.slug);
    fetchBusinesses();
  };

  const handleUploadComplete = () => {
    setCampaignRefreshKey((value) => value + 1);
  };

  const activeBusiness = selectedBusinessSlug
    ? businesses.find((business) => business.slug === selectedBusinessSlug)
    : null;

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
    <div className="app-shell">
      <header className="app-shell__header">
        <BrandMark size="sm" />
        <div className="app-shell__header-actions">
          <div className="app-shell__welcome">
            <p className="app-shell__greeting">Karibu, <strong>{user?.first_name}</strong></p>
            <p className="app-shell__helper">Track uploads, monitor the agent, and launch campaigns from here.</p>
          </div>
          <button type="button" onClick={logout} className="btn btn--ghost">
            Logout
          </button>
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
      </header>

      <main className="app-shell__main">
        <DashboardOverview
          businesses={businesses}
          message={businessMessage}
          loading={businessesLoading}
          selectedBusinessSlug={selectedBusinessSlug}
          onSelectBusiness={setSelectedBusinessSlug}
          onBusinessCreated={handleBusinessCreated}
          onReload={fetchBusinesses}
        />

        <div className="tablist" role="tablist" aria-label="Dashboard sections">
          {[{ id: 'upload', icon: '📤', label: 'Upload data' }, { id: 'campaigns', icon: '🚀', label: 'Campaigns' }].map(({ id, icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`tablist__button ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <span className="tablist__icon" aria-hidden="true">{icon}</span>
                {label}
              </button>
            );
          })}
        </div>

        {activeTab === 'upload' && <UploadSection />}
        {activeTab === 'campaigns' && <CampaignsSection />}
        {activeTab === 'upload' && (
          <UploadSection business={activeBusiness} onUploadComplete={handleUploadComplete} />
        )}
        {activeTab === 'campaigns' && (
          <CampaignsSection business={activeBusiness} refreshKey={campaignRefreshKey} />
        )}
      </main>
    </div>
  );
};

// Upload Section
const UploadSection = () => {
const BusinessCreationForm = ({ onCreated }) => {
  const [formValues, setFormValues] = useState({ name: '', industry: '', location: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/users/business/create/', formValues);
      onCreated?.(response.data);
      setFormValues({ name: '', industry: '', location: '' });
    } catch (apiError) {
      const message = getErrorMessage(apiError.response?.data, 'Unable to save business. Please try again.');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="business-form" onSubmit={handleSubmit}>
      <h4 className="business-form__title">Add a business</h4>
      <p className="business-form__hint">Provide details so PromoGPT can sync uploads to the right workspace.</p>
      {error && <p className="business-form__error" role="alert">{error}</p>}

      <div className="business-form__grid">
        <label className="form__group">
          <span className="form__label">Business name</span>
          <input
            className="form__input"
            type="text"
            value={formValues.name}
            onChange={handleChange('name')}
            placeholder="e.g. Mombasa Fresh Foods"
            required
          />
        </label>

        <label className="form__group">
          <span className="form__label">Industry</span>
          <input
            className="form__input"
            type="text"
            value={formValues.industry}
            onChange={handleChange('industry')}
            placeholder="Retail, fashion, fintech…"
            required
          />
        </label>

        <label className="form__group">
          <span className="form__label">Primary location</span>
          <input
            className="form__input"
            type="text"
            value={formValues.location}
            onChange={handleChange('location')}
            placeholder="Nairobi, Lagos, Accra…"
          />
        </label>
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={submitting} aria-live="polite">
        {submitting ? 'Saving…' : 'Save business'}
      </button>
    </form>
  );
};

const DashboardOverview = ({
  businesses,
  message,
  loading,
  selectedBusinessSlug,
  onSelectBusiness,
  onBusinessCreated,
  onReload,
}) => (
  <section className="panel panel--overview" aria-label="Dashboard overview">
    <header className="panel__header">
      <h2 className="panel__title">Your PromoGPT workspace</h2>
      <p className="panel__subtitle">This area summarises the major functions available after login.</p>
    </header>

    <div className="overview-grid">
      <article className="overview-card">
        <h3 className="overview-card__title">Agent status</h3>
        <p className="overview-card__body">
          The CampaignGenerator agent will parse uploaded CSV files, analyse revenue trends, and output a campaign kit for your African audience.
        </p>
        <ul className="overview-card__list">
          <li>✅ Reads structured Product and SalesRecord tables</li>
          <li>✅ Produces summaries, social posts, and ad copy</li>
          <li>✅ Tailors tone for Kenyan Shilling budgets and local slang</li>
        </ul>
      </article>

      <article className="overview-card">
        <div className="overview-card__header">
          <h3 className="overview-card__title">Business profiles</h3>
          {onReload && (
            <button type="button" onClick={onReload} className="link-button link-button--cta overview-card__refresh">
              Refresh list
            </button>
          )}
        </div>

        {loading ? (
          <p className="overview-card__body">Loading business profiles…</p>
        ) : businesses.length ? (
          <>
            <label className="form__group form__group--compact">
              <span className="form__label">Active workspace</span>
              <select
                className="form__input"
                value={selectedBusinessSlug}
                onChange={(event) => onSelectBusiness(event.target.value)}
              >
                {businesses.map((business) => (
                  <option key={business.slug || business.id || business.name} value={business.slug}>
                    {business.name} · {business.industry}
                  </option>
                ))}
              </select>
            </label>

            <ul className="overview-card__list">
              {businesses.map((business) => (
                <li key={`${business.slug || business.id || business.name}-summary`}>
                  <strong>{business.name}</strong> · {business.industry} · {business.location || 'Location pending'}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="overview-card__body">{message}</p>
        )}

        <BusinessCreationForm onCreated={onBusinessCreated} />
      </article>

      <article className="overview-card">
        <h3 className="overview-card__title">Major actions</h3>
        <ol className="overview-card__list overview-card__list--numbered">
          <li>Upload CSV data under the <strong>Upload data</strong> tab.</li>
          <li>Let PromoGPT clean the file and store it inside your business vault.</li>
          <li>Review campaign ideas, captions, and launch plans in <strong>Campaigns</strong>.</li>
        </ol>
        <p className="overview-card__body">Need help? Reach out to our Nairobi and Accra success teams for onboarding.</p>
      </article>
    </div>
  </section>
);

const UploadSection = ({ business, onUploadComplete }) => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const businessSlug = business?.slug;

  if (!businessSlug) {
    return (
      <section className="panel" aria-label="Upload business data">
        <header className="panel__header">
          <h2 className="panel__title">Upload your business data</h2>
          <p className="panel__subtitle">Create a business profile first to connect uploads with the agent.</p>
        </header>

        <div className="panel__empty">
          <span className="panel__empty-emoji" aria-hidden="true">🏢</span>
          <p className="panel__empty-text">Add a workspace to enable uploads.</p>
          <p className="panel__empty-helper">Use the form above to register your Kenyan or West African business, then return here.</p>
        </div>
      </section>
    );
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      setMessage({ type: 'error', text: 'Please select a CSV file.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('/business/demo-business/products/upload/', formData);
      setMessage({ type: 'success', text: 'Upload successful! Your data is being processed.' });
      await axios.post(`/business/${businessSlug}/products/upload/`, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage({
        type: 'success',
        text: `Upload successful for ${business?.name || 'your business'}! Your data is being processed.`,
      });
      setFile(null);
      onUploadComplete?.();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Upload failed. Please try again.' });
      const errorMessage = getErrorMessage(err.response?.data, 'Upload failed. Please try again.');
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Business Data</h2>
      <p className="text-gray-600 mb-6">Upload CSV files with your sales, inventory, or customer data</p>
    <section className="panel" aria-label="Upload business data">
      <header className="panel__header">
        <h2 className="panel__title">Upload your business data</h2>
        <p className="panel__subtitle">Provide CSV files with your sales, inventory, or customer records.</p>
        {business?.name && (
          <p className="panel__helper">Active workspace: <strong>{business.name}</strong></p>
        )}
      </header>

      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
        <div className={`alert ${message.type === 'success' ? 'alert--success' : 'alert--error'}`} role="status">
          {message.text}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-400 transition">
      <div className={`upload-dropzone ${file ? 'upload-dropzone--ready' : ''}`}>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="csv-upload"
          className="upload-dropzone__input"
          onChange={(event) => setFile(event.target.files[0] || null)}
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
        <label htmlFor="csv-upload" className="upload-dropzone__body">
          <span className="upload-dropzone__emoji" aria-hidden="true">
            {file ? '✅' : '📄'}
          </span>
          <span className="upload-dropzone__headline">
            {file ? file.name : 'Click to select a CSV file'}
          </span>
          <span className="upload-dropzone__description">
            {file ? 'Replace the selected file' : 'or drag and drop your file here'}
          </span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload CSV'}
      <button type="button" onClick={handleUpload} disabled={!file || uploading} className="btn btn--primary btn--block" aria-live="polite">
        {uploading ? 'Uploading…' : 'Upload CSV'}
      </button>
    </div>
    </section>
  );
};

// Campaigns Section
const CampaignsSection = () => {
const CampaignsSection = ({ business, refreshKey }) => {
  const businessSlug = business?.slug;
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formValues, setFormValues] = useState({ goal: '', budget: '' });
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchCampaigns = useCallback(async () => {
    if (!businessSlug) {
      setCampaigns([]);
      return;
    }

    setFetching(true);
    try {
      const response = await axios.get(`/business/${businessSlug}/campaigns/`);
      setCampaigns(response.data || []);
      setFeedback({ type: '', text: '' });
    } catch (error) {
      setFeedback({ type: 'error', text: 'Unable to load campaigns. Please try again.' });
    } finally {
      setFetching(false);
    }
  }, [businessSlug]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, refreshKey]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!businessSlug) {
      return;
    }

    setLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const payload = {
        goal: formValues.goal || 'Grow weekly revenue with culturally relevant messaging',
        budget: Number(formValues.budget || 0),
      };
      const response = await axios.post(`/business/${businessSlug}/campaigns/`, payload);
      setCampaigns((previous) => [response.data, ...previous]);
      setFormValues({ goal: '', budget: '' });
      setFeedback({ type: 'success', text: 'Campaign generated successfully. Review the plan below.' });
    } catch (error) {
      const message = getErrorMessage(error.response?.data, 'Unable to generate a campaign. Please try again.');
      setFeedback({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (value) => {
    const numeric = Number(value || 0);
    if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
      return 'KSh 0';
    }
    return `KSh ${numeric.toLocaleString('en-KE')}`;
  };

  if (!businessSlug) {
    return (
      <section className="panel" aria-label="Generated campaigns">
        <header className="panel__header">
          <h2 className="panel__title">Your campaigns</h2>
          <p className="panel__subtitle">Add a business profile and upload data to unlock the agent.</p>
        </header>

        <div className="panel__empty">
          <span className="panel__empty-emoji" aria-hidden="true">🚀</span>
          <p className="panel__empty-text">Create a workspace to generate campaigns.</p>
          <p className="panel__empty-helper">Once a business exists, PromoGPT can craft regional launch plans and copy.</p>
        </div>
      </section>
    );
  }

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
    <section className="panel" aria-label="Generated campaigns">
      <header className="panel__header">
        <h2 className="panel__title">Your campaigns</h2>
        <p className="panel__subtitle">
          Generate multi-channel launch plans for <strong>{business?.name}</strong> with Kenyan and West African context.
        </p>
      </header>

      <form className="campaign-form" onSubmit={handleGenerate}>
        <div className="campaign-form__grid">
          <label className="form__group">
            <span className="form__label">Campaign goal</span>
            <input
              className="form__input"
              type="text"
              value={formValues.goal}
              onChange={handleChange('goal')}
              placeholder="Boost weekend sales with a WhatsApp push"
            />
          </label>

          <label className="form__group">
            <span className="form__label">Budget (KSh)</span>
            <input
              className="form__input"
              type="number"
              min="0"
              step="1000"
              value={formValues.budget}
              onChange={handleChange('budget')}
              placeholder="50000"
            />
          </label>
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading} aria-live="polite">
          {loading ? 'Generating…' : 'Generate campaign'}
        </button>
      </form>

      {feedback.text && (
        <p className={`campaign-feedback ${feedback.type === 'error' ? 'campaign-feedback--error' : 'campaign-feedback--success'}`} role="status">
          {feedback.text}
        </p>
      )}

      {fetching ? (
        <div className="panel__empty">
          <span className="panel__empty-emoji" aria-hidden="true">⏳</span>
          <p className="panel__empty-text">Loading your campaign history…</p>
        </div>
      ) : campaigns.length ? (
        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="campaign-card">
              <header className="campaign-card__header">
                <h3 className="campaign-card__title">{campaign.goal}</h3>
                <p className="campaign-card__meta">
                  {formatBudget(campaign.budget)} · {new Date(campaign.created_at).toLocaleString('en-KE', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </header>

              {campaign.payload?.summary && (
                <pre className="campaign-card__summary">{campaign.payload.summary}</pre>
              )}

              {campaign.payload?.social_posts?.length ? (
                <div className="campaign-card__section">
                  <h4>Suggested social posts</h4>
                  <ul>
                    {campaign.payload.social_posts.map((post, index) => (
                      <li key={`${campaign.id}-post-${index}`}>
                        <strong>{post.platform}</strong>: {post.content}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {campaign.payload?.ad_copy?.length ? (
                <div className="campaign-card__section">
                  <h4>Ad copy</h4>
                  <ul>
                    {campaign.payload.ad_copy.map((ad, index) => (
                      <li key={`${campaign.id}-ad-${index}`}>
                        <strong>{ad.platform}</strong>: {ad.primary_text || ad.copy || ad.headline}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {campaign.payload?.campaign_calendar?.length ? (
                <div className="campaign-card__section">
                  <h4>Campaign calendar</h4>
                  <ul>
                    {campaign.payload.campaign_calendar.map((entry, index) => (
                      <li key={`${campaign.id}-calendar-${index}`}>
                        <strong>{entry.date}</strong>: {entry.content_type} · {entry.platform} · {entry.time}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {campaign.payload?.insights?.length ? (
                <div className="campaign-card__section">
                  <h4>Insights</h4>
                  <ul>
                    {campaign.payload.insights.map((insight, index) => (
                      <li key={`${campaign.id}-insight-${index}`}>
                        <strong>{insight.title}</strong>: {insight.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="panel__empty">
          <span className="panel__empty-emoji" aria-hidden="true">🚀</span>
          <p className="panel__empty-text">Upload your data to generate campaigns.</p>
          <p className="panel__empty-helper">Expect summaries, social packs, ad copy, and a cultural calendar tuned to African audiences.</p>
        </div>
      )}
    </section>
  );
};

// Main App Component
const DemoPage = ({ onNavigate }) => (
  <div className="page page--gradient page--centered">
    <div className="demo-card" role="presentation">
      <BrandMark size="lg" centered stacked />
      <h2 className="demo-card__title">Dashboard demo</h2>
      <p className="demo-card__subtitle">Here is what happens after you sign in to PromoGPT.</p>

      <ul className="demo-card__list">
        <li><strong>Upload tab:</strong> Drop a CSV exported from SokoPOS, Shopify, or your spreadsheet. We clean and validate every row.</li>
        <li><strong>Campaigns tab:</strong> The agent returns a launch brief, captions, ad copy, and a calendar tailored to your market.</li>
        <li><strong>Business context:</strong> Your profiles and sales history stay private inside your organisation&apos;s workspace.</li>
      </ul>

      <div className="demo-card__actions">
        <button type="button" className="btn btn--primary btn--block" onClick={() => onNavigate('signup')}>
          Create a free account
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={() => onNavigate('login')}>
          I already have access
        </button>
      </div>
    </div>
  </div>
);

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

  useEffect(() => {
    if (user && page !== 'dashboard') {
      setPage('dashboard');
    }
  }, [user, page, setPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🦁</div>
          <p className="text-gray-600">Loading...</p>
      <div className="page page--gradient page--centered">
        <div className="loading-state">
          <span className="loading-state__emoji" aria-hidden="true">🦁</span>
          <p className="loading-state__text">Loading…</p>
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
  if (page === 'signup') {
    return <SignupPage onBack={setPage} />;
  }

  if (page === 'login') {
    return <LoginPage onBack={setPage} />;
  }

  if (page === 'demo') {
    return <DemoPage onNavigate={setPage} />;
  }

  return <WelcomePage onNavigate={setPage} />;
}