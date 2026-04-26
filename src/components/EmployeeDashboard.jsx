import { useState } from 'react';
import { EMPLOYEE_DATA, avatarColor } from '../data';

const card = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
  border: '1px solid rgba(255,255,255,0.9)',
  padding: 18,
};

function Avatar({ initials, size = 34 }) {
  const bg = avatarColor(initials);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const ANNOUNCEMENT_STYLES = {
  alert:   { bg: '#fff1f2', border: '#fecdd3', icon: '🏢', iconBg: '#fee2e2' },
  info:    { bg: '#f0f9ff', border: '#bae6fd', icon: '👤', iconBg: '#e0f2fe' },
  warning: { bg: '#fffbeb', border: '#fde68a', icon: '⚠️', iconBg: '#fef3c7' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '✓', iconBg: '#dcfce7' },
};

export default function EmployeeDashboard({ user, showToast }) {
  const { announcements, myAbsences: initialAbsences, myTeam, escalationContacts, absenceReasons, absenceDurations } = EMPLOYEE_DATA;

  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [handover, setHandover] = useState('');
  const [absences, setAbsences] = useState(initialAbsences);

  const handleSubmit = () => {
    if (!reason || !duration) {
      showToast('Please select a reason and duration.', 'warning');
      return;
    }
    const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '/');
    const days = parseInt(duration) || 1;
    setAbsences(prev => [{ date: today, duration: days, reason }, ...prev]);
    showToast('Absence request submitted successfully. Your manager has been notified.', 'success');
    setReason('');
    setDuration('');
    setHandover('');
  };

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
          Good morning, {user.name}
        </h1>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 240px', gap: 16, marginBottom: 16 }}>

        {/* Announcements */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>
            Announcements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {announcements.map(a => {
              const s = ANNOUNCEMENT_STYLES[a.type] || ANNOUNCEMENT_STYLES.info;
              return (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  background: s.bg, border: `1px solid ${s.border}`,
                  borderRadius: 10, padding: '8px 10px',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: s.iconBg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, flexShrink: 0,
                  }}>{a.icon}</span>
                  <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4 }}>{a.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Absence */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>
            Submit Absence
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Absence Reason
              </label>
              <select
                value={reason} onChange={e => setReason(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                  fontSize: 13, outline: 'none', color: reason ? '#1e1b4b' : '#9ca3af',
                  background: 'white',
                }}
              >
                <option value="">Select reason…</option>
                {absenceReasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Estimated Absence Duration
              </label>
              <select
                value={duration} onChange={e => setDuration(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                  fontSize: 13, outline: 'none', color: duration ? '#1e1b4b' : '#9ca3af',
                  background: 'white',
                }}
              >
                <option value="">Select duration…</option>
                {absenceDurations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Handover Information
              </label>
              <textarea
                value={handover}
                onChange={e => setHandover(e.target.value)}
                placeholder="Describe handover notes for your team…"
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                  fontSize: 12, outline: 'none', resize: 'none',
                  height: 80, lineHeight: 1.5, color: '#374151',
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                padding: '11px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                color: 'white', fontFamily: 'inherit', fontWeight: 700,
                fontSize: 13, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              }}
            >
              Submit
            </button>
          </div>
        </div>

        {/* My Absences */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>
            My Absences
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Duration', 'Reason'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', fontSize: 10, fontWeight: 700,
                    color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px',
                    paddingBottom: 8, borderBottom: '1px solid #f3f4f6',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {absences.map((ab, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '9px 0', fontSize: 12, color: '#374151', fontWeight: 500 }}>{ab.date}</td>
                  <td style={{ padding: '9px 0', fontSize: 12, color: '#374151' }}>{ab.duration} Days</td>
                  <td style={{ padding: '9px 0' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: ab.reason === 'Sickness' || ab.reason === 'Covid' ? '#fee2e2' : '#f3f4f6',
                      color: ab.reason === 'Sickness' || ab.reason === 'Covid' ? '#991b1b' : '#374151',
                    }}>{ab.reason}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Escalation Contacts */}
        <div style={{ ...card, overflowY: 'auto', maxHeight: 460 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>
            Escalation Contacts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {escalationContacts.map(c => (
              <div key={c.id} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '8px', borderRadius: 10,
                background: 'rgba(124,58,237,0.04)',
                border: '1px solid rgba(124,58,237,0.07)',
              }}>
                <Avatar initials={c.initials} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{c.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                      background: '#ede9fe', color: '#7c3aed',
                    }}>{c.role}</span>
                  </div>
                  <a href={`tel:${c.phone}`} style={{ fontSize: 10, color: '#7c3aed', display: 'block', textDecoration: 'none', fontWeight: 500 }}>
                    {c.phone}
                  </a>
                  <a href={`mailto:${c.email}`} style={{ fontSize: 10, color: '#6b7280', textDecoration: 'none' }}>
                    {c.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Team row */}
      <div style={card}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>My Team</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {myTeam.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(124,58,237,0.04)',
              border: '1px solid rgba(124,58,237,0.07)',
            }}>
              <Avatar initials={m.initials} size={36} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b', display: 'block' }}>{m.name}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                background: m.status === 'available' ? '#d1fae5' : '#fee2e2',
                color: m.status === 'available' ? '#065f46' : '#991b1b',
              }}>
                {m.status === 'available' ? 'available' : 'absent'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
