import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ role }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    return (
        <header className="dashboard-header">
            <div className="header-left">
                <div className="logo">M</div>
                <div>
                    <div className="app-title">MediCare Companion</div>
                    <div className="app-subtitle">{role} View</div>
                </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>
    );
};

export default Header; 