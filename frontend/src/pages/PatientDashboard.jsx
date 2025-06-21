import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './PatientDashboard.css';
import { FaUser, FaCamera, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaBan } from 'react-icons/fa';
import { useMedications, useMarkAsTaken, useAddMedication, useUpdateMedication, useDeleteMedication } from '../api/medications';
import { useLogs } from '../api/intake';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning!';
  } else if (hour < 17) {
    return 'Good Afternoon!';
  } else {
    return 'Good Evening!';
  }
}

function PatientDashboard() {
  // Calendar state
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  });
  const [dayStreak, setDayStreak] = useState(0);

  // Get user from local storage
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    let currentStreak = parseInt(localStorage.getItem('dayStreak') || '0', 10);
    const lastTakenDate = localStorage.getItem('lastTakenDate');

    if (lastTakenDate) {
      const todayDate = new Date();
      const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(
        todayDate.getDate()
      ).padStart(2, '0')}`;

      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(
        yesterdayDate.getDate()
      ).padStart(2, '0')}`;

      if (lastTakenDate !== todayKey && lastTakenDate !== yesterdayKey) {
        currentStreak = 0;
        localStorage.setItem('dayStreak', '0');
      }
    }
    setDayStreak(currentStreak);
  }, []);

  // Get dynamic greeting
  const greeting = getGreeting();

  // Data hooks
  const { data: medications = [], isLoading: medsLoading, error: medsError } = useMedications();
  const { data: logs = [], isLoading: logsLoading, error: logsError } = useLogs();
  const markAsTaken = useMarkAsTaken();
  const addMedication = useAddMedication();
  const updateMedication = useUpdateMedication();
  const deleteMedication = useDeleteMedication();

  // Proof photo (mock)
  const [proofPhoto, setProofPhoto] = useState(null);
  const handlePhotoChange = e => {
    if (e.target.files && e.target.files[0]) {
      setProofPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Medication modal state
  const [showModal, setShowModal] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '' });
  const [formError, setFormError] = useState('');

  const openAdd = () => {
    setForm({ name: '', dosage: '', frequency: '' });
    setEditMed(null);
    setShowModal(true);
    setFormError('');
  };
  const openEdit = (med) => {
    setForm({ name: med.name, dosage: med.dosage, frequency: med.frequency });
    setEditMed(med);
    setShowModal(true);
    setFormError('');
  };
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.dosage || !form.frequency) {
      setFormError('All fields are required.');
      return;
    }
    try {
      if (editMed) {
        await updateMedication.mutateAsync({ id: editMed.id, ...form });
      } else {
        await addMedication.mutateAsync(form);
      }
      setShowModal(false);
    } catch (err) {
      setFormError('Failed to save medication.');
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this medication?')) {
      await deleteMedication.mutateAsync(id);
    }
  };

  // --- Adherence Calculation ---
  const monthlyLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === calendarYear && logDate.getMonth() === calendarMonth;
  });
  const takenCurrentMonth = monthlyLogs.filter(l => l.taken).length;
  const missedCurrentMonth = monthlyLogs.filter(l => !l.taken).length;
  const totalLoggedDays = takenCurrentMonth + missedCurrentMonth;
  const monthlyRate = totalLoggedDays > 0 ? Math.round((takenCurrentMonth / totalLoggedDays) * 100) : 0;
  // -------------------------

  // Calendar coloring from logs
  const takenDates = logs.filter(l => l.taken).map(l => l.date);
  const missedDates = logs.filter(l => !l.taken).map(l => l.date);
  const getDateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Calendar grid
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

  // Selected date key
  const selectedKey = getDateKey(selectedDate.year, selectedDate.month, selectedDate.day);
  const todayKey = getDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Medications for selected date (for demo, show all)
  const selectedMeds = medications.filter(med => true);

  // Check if selected date is today, past, or future
  const selectedDateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
  const isToday = selectedKey === todayKey;
  const isPast = selectedDateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isFuture = selectedDateObj > new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelectedTaken = takenDates.includes(selectedKey);
  const isTodayTaken = takenDates.includes(todayKey);

  // Mark as taken handler
  const handleMarkAsTaken = async (medId, medDateKey) => {
    if (!isToday) return;
    if (isSelectedTaken) return;
    try {
      await markAsTaken.mutateAsync(medId);

      const lastTakenDate = localStorage.getItem('lastTakenDate');
      const todayDate = new Date();
      const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(
        todayDate.getDate()
      ).padStart(2, '0')}`;

      if (medDateKey === todayKey && lastTakenDate !== todayKey) {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayKey = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(
          yesterdayDate.getDate()
        ).padStart(2, '0')}`;

        let currentStreak = parseInt(localStorage.getItem('dayStreak') || '0', 10);

        if (lastTakenDate === yesterdayKey) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }

        localStorage.setItem('dayStreak', currentStreak.toString());
        localStorage.setItem('lastTakenDate', todayKey);
        setDayStreak(currentStreak);
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="dashboard-bg">
      <Header role="Patient" />
      <div className="dashboard-content">
        {/* Greeting Card */}
        <section className="greeting-card">
          <div className="greeting-top">
            <div className="greeting-icon"><FaUser size={36} /></div>
            <div>
              <div className="greeting-title">{greeting} {user?.username}!</div>
              <div className="greeting-desc">Ready to stay on track with your medication?</div>
            </div>
          </div>
          <div className="greeting-metrics">
            <div className="metric-box">
              <div className="metric-value">{dayStreak}</div>
              <div className="metric-label">Day Streak</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">
                {isTodayTaken ? <FaCheckCircle color="#16a34a" size={22} title="Taken" /> : <span className="metric-circle" />}
              </div>
              <div className="metric-label">Today's Status</div>
            </div>
            <div className="metric-box">
              <div className="metric-value">{logsLoading ? '...' : `${monthlyRate}%`}</div>
              <div className="metric-label">Monthly Rate</div>
            </div>
          </div>
        </section>

        {/* Medication Management Section */}
        <section className="medications-list-card">
          <div className="medications-list-header">
            <div className="medications-list-title">All Medications</div>
            <button className="add-med-btn" onClick={openAdd}><FaPlus style={{ marginRight: 6 }} />Add</button>
          </div>
          {medsLoading ? (
            <div>Loading...</div>
          ) : medsError ? (
            <div className="error">Error loading medications</div>
          ) : medications.length === 0 ? (
            <div style={{ color: '#888', fontSize: 15 }}>No medications yet.</div>
          ) : (
            <ul className="medications-list">
              {medications.map(med => (
                <li key={med.id} className="medications-list-item">
                  <div>
                    <div className="med-name">{med.name}</div>
                    <div className="med-details">{med.dosage} &middot; {med.frequency}</div>
                  </div>
                  <div className="med-actions">
                    <button className="edit-btn" onClick={() => openEdit(med)}><FaEdit /></button>
                    <button className="delete-btn" onClick={() => handleDelete(med.id)}><FaTrash /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* Add/Edit Medication Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
              <h3 style={{ marginBottom: 16 }}>{editMed ? 'Edit Medication' : 'Add Medication'}</h3>
              {formError && <div className="error">{formError}</div>}
              <form onSubmit={handleFormSubmit} autoComplete="off">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={handleFormChange} required />
                <label htmlFor="dosage">Dosage</label>
                <input id="dosage" name="dosage" value={form.dosage} onChange={handleFormChange} required />
                <label htmlFor="frequency">Frequency</label>
                <input id="frequency" name="frequency" value={form.frequency} onChange={handleFormChange} required />
                <button type="submit" style={{ width: '100%' }} disabled={addMedication.isLoading || updateMedication.isLoading}>
                  {editMed ? 'Save' : 'Add'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="dashboard-main">
          <section className="medication-card">
            <div className="medication-title"><FaCalendarAlt style={{ marginRight: 8 }} /> Medication for {selectedDate.day}/{selectedDate.month + 1}/{selectedDate.year}</div>
            {medsLoading ? (
              <div>Loading...</div>
            ) : medsError ? (
              <div className="error">Error loading medications</div>
            ) : selectedMeds.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15 }}>No medications for this date.</div>
            ) : isSelectedTaken ? (
              <>
                <div className="medication-completed-view">
                  <div className="completed-icon">
                    <FaCheckCircle size={48} />
                  </div>
                  <div className="completed-title">Medication Completed!</div>
                  <div className="completed-desc">
                    Great job! You've taken your medication for{' '}
                    {new Date(selectedKey.replace(/-/g, '/')).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    .
                  </div>
                </div>
                {selectedMeds.map(med => (
                  <div className="medication-set" key={med.id}>
                    <span className="medication-set-icon completed">
                      <FaCheckCircle />
                    </span>
                    <span className="medication-set-desc">{med.name} ({med.dosage}, {med.frequency})</span>
                    <span className="medication-set-time">8:00 AM</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {selectedMeds.map(med => {
                  // Determine button state and text
                  let btnText = 'Mark as Taken';
                  let btnIcon = '✓';
                  let btnDisabled = false;
                  if (!isToday) {
                    btnText = 'Cannot Mark as Taken';
                    btnIcon = <FaBan color="#dc2626" style={{ marginRight: 6 }} />;
                    btnDisabled = true;
                  }
                  return (
                    <div className="medication-set" key={med.id}>
                      <span className="medication-set-num">{med.id}</span>
                      <span className="medication-set-desc">{med.name} ({med.dosage}, {med.frequency})</span>
                      <span className="medication-set-time">8:00 AM</span>
                      <button
                        className="mark-taken-btn"
                        onClick={() => handleMarkAsTaken(med.id, selectedKey)}
                        disabled={btnDisabled || markAsTaken.isLoading}
                      >
                        {btnIcon} {btnText}
                      </button>
                    </div>
                  );
                })}
                <div className="proof-photo">
                  <div className="proof-photo-icon"><FaCamera size={40} /></div>
                  <div className="proof-photo-title">Add Proof Photo (Optional)</div>
                  <div className="proof-photo-desc">Take a photo of your medication or pill organizer as confirmation</div>
                  <input type="file" accept="image/*" style={{ display: 'none' }} id="proof-photo-input" onChange={handlePhotoChange} />
                  <label htmlFor="proof-photo-input" className="take-photo-btn"><FaCamera style={{ marginRight: 6 }} /> Take Photo</label>
                  {proofPhoto && <img src={proofPhoto} alt="Proof" style={{ marginTop: 10, maxWidth: 120, borderRadius: 8 }} />}
                </div>
              </>
            )}
          </section>
          <aside className="calendar-card">
            <div className="calendar-title">Medication Calendar</div>
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
                          style={{ cursor: 'pointer' }}
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
              <span><span className="legend-dot today"></span> Today</span>
              <span><span className="legend-dot selected"></span> Selected</span>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default PatientDashboard; 