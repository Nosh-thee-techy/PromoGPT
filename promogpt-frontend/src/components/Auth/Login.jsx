import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';

const Login = () => {
  const [credentials, setCredentialsField] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentialsField(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      dispatch(setCredentials({ user: data.user, token: data.access }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', marginTop: 80 }}>
      <h3>Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleChange} value={credentials.email} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control name="password" type="password" placeholder="Password" onChange={handleChange} value={credentials.password} required />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading} className="w-100">
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Form>
  );
};

export default Login;
