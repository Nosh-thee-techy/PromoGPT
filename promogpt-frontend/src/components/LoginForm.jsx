import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ marginBottom: 8, padding: 8, width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ marginBottom: 12, padding: 8, width: '100%' }}
      />
      <button onClick={() => login(email, password)} style={{ padding: '8px 16px' }}>
        Login
      </button>
    </div>
  );
};

export default LoginForm;
