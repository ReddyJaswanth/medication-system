import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/PatientDashboard';
import RequireAuth from './components/RequireAuth';
import Landing from './pages/Landing';
import CaretakerDashboard from './pages/CaretakerDashboard';

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function App() {
  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/caretaker-dashboard" element={<CaretakerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
