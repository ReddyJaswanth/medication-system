import React, { useState } from 'react';
import Header from '../components/Header';
import './CaretakerDashboard.css';
import {
    FaUserFriends, FaEnvelope, FaBell, FaCalendarAlt,
    FaCheckCircle, FaExclamationTriangle, FaCamera, FaClock
} from 'react-icons/fa';

// Mock data for the entire component
const mockLogs = [
    { id: 1, date: '2025-06-10', taken: true, proofPhoto: true },
    { id: 2, date: '2025-06-09', taken: true, proofPhoto: false },
    { id: 3, date: '2025-06-08', taken: false, proofPhoto: false },
    { id: 4, date: '2025-06-07', taken: true, proofPhoto: true },
    { id: 5, date: '2025-06-06', taken: true, proofPhoto: false },
];

const adherenceRate = 85;
const currentStreak = 5;
const missedThisMonth = 3;
const takenThisWeek = 4;
const takenDays = 22;
const missedDays = 3;
const remainingDays = 5;

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

const CaretakerDashboard = () => {
    const [tab, setTab] = useState('overview');
    const logs = mockLogs; // Use mock logs

    // State for notifications tab
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [missedAlerts, setMissedAlerts] = useState(true);
    const [emailAddress, setEmailAddress] = useState('caretaker@example.com');
    const [alertTimeframe, setAlertTimeframe] = useState('2 hours');
    const [reminderTime, setReminderTime] = useState('20:00');

    // Calendar state
    const today = new Date();
    const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
    const [calendarYear, setCalendarYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate(),
    });

    // Calendar data processing
    const takenDates = logs.filter(l => l.taken).map(l => l.date);
    const missedDates = logs.filter(l => !l.taken).map(l => l.date);
    const getDateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

    const calendarRows = [];
    let dayCounter = 1 - firstDayOfWeek;
    for (let week = 0; week < 6; week++) {
        const row = [];
        for (let d = 0; d < 7; d++) {
            if (dayCounter < 1 || dayCounter > daysInMonth) {
                row.push(null);
            } else {
                row.push(dayCounter);
            }
            dayCounter++;
        }
        calendarRows.push(row);
        if (dayCounter > daysInMonth) break;
    }

    const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long' });

    return (
        <div className="dashboard-bg">
            <Header role="Caretaker" />
            <div className="dashboard-content">
                {/* Greeting Card */}
                <section className="caretaker-greeting-card">
                    <div className="caretaker-greeting-top">
                        <div className="greeting-icon caretaker"><FaUserFriends size={36} /></div>
                        <div>
                            <div className="caretaker-title">Caretaker Dashboard</div>
                            <div className="caretaker-desc">Monitoring Eleanor Thompson's medication adherence</div>
                        </div>
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
                    <button className={tab === 'activity' ? 'active' : ''} onClick={() => setTab('activity')}>Recent Activity</button>
                    <button className={tab === 'calendar' ? 'active' : ''} onClick={() => setTab('calendar')}>Calendar View</button>
                    <button className={tab === 'notifications' ? 'active' : ''} onClick={() => setTab('notifications')}>Notifications</button>
                </div>

                {/* Overview Tab */}
                {tab === 'overview' && (
                    <>
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
                    </>
                )}

                {/* Recent Activity Tab */}
                {tab === 'activity' && (
                    <section className="recent-activity-card">
                        <h3 className="recent-activity-title">Recent Medication Activity</h3>
                        <ul className="activity-list">
                            {logs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                                <li key={log.id} className="activity-item">
                                    <div className={`activity-icon ${log.taken ? 'completed' : 'missed'}`}>
                                        {log.taken ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                    </div>
                                    <div className="activity-details">
                                        <div className="activity-date">
                                            {new Date(log.date.replace(/-/g, '/')).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <div className="activity-status-text">
                                            {log.taken ? `Taken at 8:30 AM` : 'Medication missed'}
                                        </div>
                                    </div>
                                    <div className="activity-actions">
                                        {log.proofPhoto && (
                                            <button className="photo-btn"><FaCamera style={{ marginRight: 6 }} /> Photo</button>
                                        )}
                                        <span className={`status-badge activity ${log.taken ? 'completed' : 'missed'}`}>
                                            {log.taken ? 'Completed' : 'Missed'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Calendar View Tab */}
                {tab === 'calendar' && (
                    <section className="calendar-view-card">
                        <h3 className="calendar-view-title">Medication Calendar Overview</h3>
                        <div className="calendar-view-content">
                            <div className="calendar-container">
                                <div className="calendar-controls">
                                    <button onClick={() => setCalendarMonth(m => m === 0 ? 11 : m - 1)}>{'<'}</button>
                                    <span>{monthName} {calendarYear}</span>
                                    <button onClick={() => setCalendarMonth(m => m === 11 ? 0 : m + 1)}>{'>'}</button>
                                </div>
                                <table className="calendar-table">
                                    <thead>
                                        <tr>
                                            <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calendarRows.map((row, weekIdx) => (
                                            <tr key={weekIdx}>
                                                {row.map((date, dayIdx) => {
                                                    if (!date) return <td key={dayIdx}></td>;
                                                    let className = '';
                                                    const dateKey = getDateKey(calendarYear, calendarMonth, date);
                                                    const isTodayCell =
                                                        date === today.getDate() &&
                                                        calendarMonth === today.getMonth() &&
                                                        calendarYear === today.getFullYear();

                                                    if (isTodayCell) className = 'today';
                                                    else if (takenDates.includes(dateKey)) className = 'taken';
                                                    else if (missedDates.includes(dateKey)) className = 'missed';

                                                    if (selectedDate.year === calendarYear && selectedDate.month === calendarMonth && selectedDate.day === date) {
                                                        className += ' selected';
                                                    }

                                                    return (
                                                        <td
                                                            key={dayIdx}
                                                            className={className.trim()}
                                                            onClick={() => setSelectedDate({ year: calendarYear, month: calendarMonth, day: date })}
                                                        >
                                                            {date}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="calendar-legend">
                                    <span><span className="legend-dot taken"></span> Medication taken</span>
                                    <span><span className="legend-dot missed"></span> Missed medication</span>
                                    <span><span className="legend-dot today-legend"></span> Today</span>
                                </div>
                            </div>
                            <aside className="calendar-details">
                                <h4 className="details-title">
                                    Details for {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </h4>
                                <div className="details-box">
                                    <FaClock style={{ color: '#3b82f6', marginRight: 12, marginTop: 4, flexShrink: 0 }} size={24} />
                                    <div>
                                        <div className="details-box-title">Today</div>
                                        <div className="details-box-desc">Monitor Eleanor Thompson's medication status for today.</div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </section>
                )}

                {/* Notifications Tab */}
                {tab === 'notifications' && (
                    <div className="notifications-container">
                        <section className="notification-settings-card">
                            <h3 className="notification-view-title"><FaBell /> Notification Preferences</h3>

                            <div className="notification-option">
                                <div className="option-header">
                                    <div className="option-text">
                                        <div className="option-title">Email Notifications</div>
                                        <div className="option-desc">Receive medication alerts via email</div>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                {emailNotifications && (
                                    <div className="option-content">
                                        <label htmlFor="email-address">Email Address</label>
                                        <input id="email-address" type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} />
                                    </div>
                                )}
                            </div>

                            <div className="notification-option">
                                <div className="option-header">
                                    <div className="option-text">
                                        <div className="option-title">Missed Medication Alerts</div>
                                        <div className="option-desc">Get notified when medication is not taken on time</div>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={missedAlerts} onChange={() => setMissedAlerts(!missedAlerts)} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                {missedAlerts && (
                                    <div className="option-content">
                                        <label htmlFor="alert-timeframe">Alert me if medication isn't taken within</label>
                                        <select id="alert-timeframe" value={alertTimeframe} onChange={e => setAlertTimeframe(e.target.value)}>
                                            <option>1 hour</option>
                                            <option>2 hours</option>
                                            <option>4 hours</option>
                                            <option>8 hours</option>
                                        </select>
                                        <label htmlFor="reminder-time">Daily reminder time</label>
                                        <input id="reminder-time" type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} />
                                        <div className="input-desc">Time to check if today's medication was taken</div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="email-preview-card">
                            <h3 className="preview-title"><FaEnvelope /> Email Preview</h3>
                            <div className="preview-content">
                                <p><strong>Subject: Medication Alert - Eleanor Thompson</strong></p>
                                <p>Hello,</p>
                                <p>This is a reminder that Eleanor Thompson has not taken her medication today.</p>
                                <p>Please check with her to ensure she takes her prescribed medication.</p>
                                <br />
                                <p>Current adherence rate: 85% (5-day streak)</p>
                            </div>
                        </section>

                        <div className="save-settings-container">
                            <button className="save-settings-btn">Save Notification Settings</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaretakerDashboard; 