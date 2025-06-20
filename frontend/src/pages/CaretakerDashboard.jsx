import React, { useState } from 'react';
import Header from '../components/Header';
import './CaretakerDashboard.css';
import { FaUserFriends, FaEnvelope, FaBell, FaCalendarAlt } from 'react-icons/fa';

const CaretakerDashboard = () => {
    const [tab, setTab] = useState('overview');
    // Mock data
    const adherenceRate = 85;
    const currentStreak = 5;
    const missedThisMonth = 3;
    const takenThisWeek = 4;
    const takenDays = 22;
    const missedDays = 3;
    const remainingDays = 5;

    return (
        <div className="dashboard-bg">
            <Header role="Caretaker" />
            <div className="dashboard-content">
                {/* Greeting Card */}
                <section className="caretaker-greeting-card">
                    <div className="greeting-icon caretaker"><FaUserFriends size={36} /></div>
                    <div>
                        <div className="caretaker-title">Caretaker Dashboard</div>
                        <div className="caretaker-desc">Monitoring Eleanor Thompson's medication adherence</div>
                    </div>
                    <div className="caretaker-metrics">
                        <div className="metric-box">
                            <div className="metric-value">{adherenceRate}%</div>
                            <div className="metric-label">Adherence Rate</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-value">{currentStreak}</div>
                            <div className="metric-label">Current Streak</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-value">{missedThisMonth}</div>
                            <div className="metric-label">Missed This Month</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-value">{takenThisWeek}</div>
                            <div className="metric-label">Taken This Week</div>
                        </div>
                    </div>
                </section>
                {/* Tabs */}
                <div className="caretaker-tabs">
                    <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
                    <button className={tab === 'activity' ? '' : ''} onClick={() => setTab('activity')}>Recent Activity</button>
                    <button className={tab === 'calendar' ? '' : ''} onClick={() => setTab('calendar')}>Calendar View</button>
                    <button className={tab === 'notifications' ? '' : ''} onClick={() => setTab('notifications')}>Notifications</button>
                </div>
                {/* Main Content */}
                <main className="caretaker-main">
                    <section className="caretaker-status-card">
                        <div className="status-title"><FaCalendarAlt style={{ marginRight: 8 }} /> Today's Status</div>
                        <div className="status-set">
                            <span className="status-set-desc">Daily Medication Set</span>
                            <span className="status-set-time">8:00 AM</span>
                            <span className="status-badge pending">Pending</span>
                        </div>
                    </section>
                    <aside className="caretaker-actions-card">
                        <div className="actions-title">Quick Actions</div>
                        <button className="action-btn"><FaEnvelope style={{ marginRight: 8 }} /> Send Reminder Email</button>
                        <button className="action-btn"><FaBell style={{ marginRight: 8 }} /> Configure Notifications</button>
                        <button className="action-btn"><FaCalendarAlt style={{ marginRight: 8 }} /> View Full Calendar</button>
                    </aside>
                </main>
                <section className="adherence-progress-card">
                    <div className="progress-title">Monthly Adherence Progress</div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: adherenceRate + '%' }}></div>
                        <span className="progress-label">{adherenceRate}%</span>
                    </div>
                    <div className="progress-legend">
                        <span className="taken">{takenDays} days<br />Taken</span>
                        <span className="missed">{missedDays} days<br />Missed</span>
                        <span className="remaining">{remainingDays} days<br />Remaining</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CaretakerDashboard; 