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

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: `${accent}25` }} />
      </div>
      {children}
    </div>
  );
}

function Avatar({ initials, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(initials), color: 'white',
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
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '✓',  iconBg: '#dcfce7' },
};

const MY_STATS = {
  daysAbsentYear: 37,
  allowanceTotal: 50,
  allowanceUsed: 37,
  bradfordScore: 112,
  bradfordThreshold: 150,
  lastAbsence: '12/02/2025',
};

export default function EmployeeDashboard({ user, showToast }) {
  const { announcements, myAbsences: initialAbsences, myTeam, escalationContacts, absenceReasons, absenceDurations } = EMPLOYEE_DATA;

  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [handover, setHandover] = useState('');
  const [absences, setAbsences] = useState(initialAbsences);

  const handleSubmit = () => {
    if (!reason || !duration) { showToast('Please select a reason and duration.', 'warning'); return; }
    const today = new Date().toLocaleDateString('en-GB');
    const days = parseInt(duration) || 1;
    setAbsences(prev => [{ date: today, duration: days, reason }, ...prev]);
    showToast('Absence submitted. Your manager has been notified.', 'success');
    setReason(''); setDuration(''); setHandover('');
  };

  const bradfordPct = Math.min((MY_STATS.bradfordScore / MY_STATS.bradfordThreshold) * 100, 100);
  const allowancePct = Math.min((MY_STATS.allowanceUsed / MY_STATS.allowanceTotal) * 100, 100);

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
          Good morning, {user.name}
        </h1>
      </div>

      {/* ── Section 1: Today ─────────────────────────────────────────── */}
      <Section title="Today" accent="#7c3aed">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>

          {/* Announcements */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>Announcements</h3>
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
                      width: 22, height: 22, borderRadius: '50%', background: s.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, flexShrink: 0,
                    }}>{a.icon}</span>
                    <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4 }}>{a.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Absence Stats — new card */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>My Absence Overview</h3>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>Your personal readiness metrics for this year</p>

            {/* Bradford Factor */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b' }}>Bradford Factor</span>
                  <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 6 }}>Review triggers at 150</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: bradfordPct > 80 ? '#dc2626' : '#f59e0b' }}>
                  {MY_STATS.bradfordScore}
                </span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${bradfordPct}%`, height: '100%', borderRadius: 4,
                  background: bradfordPct > 80 ? '#ef4444' : bradfordPct > 60 ? '#f59e0b' : '#10b981',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>
                {MY_STATS.bradfordThreshold - MY_STATS.bradfordScore} points before formal review
              </div>
            </div>

            {/* Allowance used */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b' }}>Absence Allowance</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>
                  {MY_STATS.allowanceUsed} / {MY_STATS.allowanceTotal} days
                </span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${allowancePct}%`, height: '100%', borderRadius: 4,
                  background: 'linear-gradient(90deg, #7c3aed, #db2777)',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>

            {/* Quick stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Days This Year', value: MY_STATS.daysAbsentYear, color: '#db2777', bg: '#fce7f3' },
                { label: 'Remaining', value: MY_STATS.allowanceTotal - MY_STATS.allowanceUsed, color: '#059669', bg: '#d1fae5' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px', borderRadius: 12, background: s.bg, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
              Last absence recorded: <strong style={{ color: '#6b7280' }}>{MY_STATS.lastAbsence}</strong>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section 2: Absence Management ────────────────────────────── */}
      <Section title="Absence Management" accent="#db2777">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, alignItems: 'start' }}>

          {/* Submit Absence */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>Submit Absence</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Absence Reason
                </label>
                <select value={reason} onChange={e => setReason(e.target.value)} style={{
                  width: '100%', padding: '9px 12px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                  fontSize: 13, outline: 'none', background: 'white',
                  color: reason ? '#1e1b4b' : '#9ca3af',
                }}>
                  <option value="">Select reason…</option>
                  {absenceReasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Estimated Duration
                </label>
                <select value={duration} onChange={e => setDuration(e.target.value)} style={{
                  width: '100%', padding: '9px 12px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                  fontSize: 13, outline: 'none', background: 'white',
                  color: duration ? '#1e1b4b' : '#9ca3af',
                }}>
                  <option value="">Select duration…</option>
                  {absenceDurations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Handover Information
                </label>
                <textarea value={handover} onChange={e => setHandover(e.target.value)}
                  placeholder="Describe handover notes for your team…"
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 10,
                    border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                    fontSize: 12, outline: 'none', resize: 'none',
                    height: 80, lineHeight: 1.5, color: '#374151',
                  }} />
              </div>
              <button onClick={handleSubmit} style={{
                padding: '11px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                color: 'white', fontFamily: 'inherit', fontWeight: 700,
                fontSize: 13, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              }}>
                Submit Absence
              </button>
            </div>
          </div>

          {/* My Absences table */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>My Absence History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Date', 'Duration', 'Reason'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      paddingBottom: 10, borderBottom: '1px solid #f3f4f6',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {absences.map((ab, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '10px 0', fontSize: 12, color: '#374151', fontWeight: 500 }}>{ab.date}</td>
                    <td style={{ padding: '10px 0', fontSize: 12, color: '#374151' }}>{ab.duration} Days</td>
                    <td style={{ padding: '10px 0' }}>
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
            {absences.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, paddingTop: 20 }}>No absences recorded</p>
            )}
          </div>
        </div>
      </Section>

      {/* ── Section 3: Team & Support ─────────────────────────────────── */}
      <Section title="Team & Support" accent="#059669">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>

          {/* My Team */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>My Team</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myTeam.map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.08)',
                }}>
                  <Avatar initials={m.initials} size={36} />
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#1e1b4b' }}>{m.name}</span>
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

          {/* Escalation Contacts */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>Escalation Contacts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {escalationContacts.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  padding: '8px 10px', borderRadius: 10,
                  background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.07)',
                }}>
                  <Avatar initials={c.initials} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{c.name}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                        background: '#d1fae5', color: '#059669',
                      }}>{c.role}</span>
                    </div>
                    <a href={`tel:${c.phone}`} style={{ fontSize: 10, color: '#059669', display: 'block', textDecoration: 'none', fontWeight: 500 }}>
                      {c.phone}
                    </a>
                  </div>
                  <a href={`mailto:${c.email}`}
                    onClick={e => { e.preventDefault(); showToast(`Email drafted to ${c.name}.`, 'info'); }}
                    style={{
                      fontSize: 11, padding: '5px 10px', borderRadius: 8,
                      background: '#d1fae5', color: '#059669', fontWeight: 600, textDecoration: 'none',
                      flexShrink: 0,
                    }}>
                    Email
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
