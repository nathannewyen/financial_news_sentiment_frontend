import React, { useState } from 'react';
import '../styles/AuthForm.css';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: { username?: string; email: string; password: string }) => void;
  loading?: boolean;
  error?: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      onSubmit({ username, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <div className="auth-logo">N</div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{mode === 'login' ? 'Please enter your credentials to access your account' : 'Sign up to get started'}</p>
        </div>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>
        {mode === 'login' && (
          <div className="auth-links">
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
        )}
        <div className="auth-divider">Or continue with</div>
        <div className="auth-socials">
          <button type="button" className="social-btn" disabled>Google</button>
          <button type="button" className="social-btn" disabled>Apple</button>
        </div>
        <div className="auth-footer">
          {mode === 'login' ? (
            <>Don't have an account? <a href="#" className="switch-link">Sign up</a></>
          ) : (
            <>Already have an account? <a href="#" className="switch-link">Sign in</a></>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm; 