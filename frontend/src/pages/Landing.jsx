import React from 'react';
import { FaHeart, FaUser, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const handlePatient = () => {
        localStorage.setItem('selectedRole', 'patient');
        navigate('/login');
    };
    const handleCaretaker = () => {
        localStorage.setItem('selectedRole', 'caretaker');
        navigate('/register');
    };

    return (
        <div className="landing-bg">
            <div className="landing-center">
                <div className="landing-icon">
                    <FaHeart size={64} color="#2ecc71" />
                </div>
                <h1 className="landing-title">Welcome to MediCare Companion</h1>
                <p className="landing-subtitle">
                    Your trusted partner in medication management. Choose your role to get started with personalized features.
                </p>
                <div className="landing-cards">
                    <div className="landing-card patient">
                        <div className="card-icon patient"><FaUser size={48} /></div>
                        <h2>I'm a Patient</h2>
                        <p>Track your medication schedule and maintain your health records</p>
                        <ul>
                            <li>Mark medications as taken</li>
                            <li>Upload proof photos (optional)</li>
                            <li>View your medication calendar</li>
                            <li>Large, easy-to-use interface</li>
                        </ul>
                        <button className="card-btn patient" onClick={handlePatient}>Continue as Patient</button>
                    </div>
                    <div className="landing-card caretaker">
                        <div className="card-icon caretaker"><FaUserFriends size={48} /></div>
                        <h2>I'm a Caretaker</h2>
                        <p>Monitor and support your loved one's medication adherence</p>
                        <ul>
                            <li>Monitor medication compliance</li>
                            <li>Set up notification preferences</li>
                            <li>View detailed reports</li>
                            <li>Receive email alerts</li>
                        </ul>
                        <button className="card-btn caretaker" onClick={handleCaretaker}>Continue as Caretaker</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing; 