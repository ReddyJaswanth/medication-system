import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = '/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: 'patient' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('patient');

  useEffect(() => {
    const role = localStorage.getItem('selectedRole') || 'patient';
    setSelectedRole(role);
    setForm(f => ({ ...f, role }));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password || !form.role) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card register-card ${selectedRole}`}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        Register as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
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
        <input type="hidden" name="role" value={selectedRole} />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Login</a>
      </div>
    </div>
  );
} 