import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = '/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const selectedRole = localStorage.getItem('selectedRole') || 'patient';

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(`/${selectedRole === 'patient' ? 'dashboard' : 'caretaker-dashboard'}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card login-card ${selectedRole}`}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
      </h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          autoFocus
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>
        Don&apos;t have an account?{' '}
        <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Register</a>
      </div>
    </div>
  );
} 