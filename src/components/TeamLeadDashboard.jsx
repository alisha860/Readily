import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import WorldMap from './WorldMap';
import { TEAM_LEAD_DATA, avatarColor } from '../data';

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

function Avatar({ initials, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(initials), color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function EscalateModal({ onClose, showToast }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 20, padding: 32,
        maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.25s ease',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>🚨</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Escalate to HR</h2>
        <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
          This will notify the HR team of a critical staffing situation. They will be alerted immediately.
        </p>
        <textarea placeholder="Add notes for HR (optional)..." style={{
          width: '100%', padding: '10px 12px', borderRadius: 10,
          border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 13,
          resize: 'none', height: 80, marginBottom: 16, outline: 'none',
        }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e5e7eb',
            background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
          }}>Cancel</button>
          <button onClick={() => { showToast('HR notified. Expect a response within 15 minutes.', 'success'); onClose(); }} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
          }}>Confirm Escalation</button>
        </div>
      </div>
    </div>
  );
}

export default function TeamLeadDashboard({ user, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const { team, absencePct, totalTeam, absentToday, comparisonData, criticalStaff, sites } = TEAM_LEAD_DATA;

  const pieData = [
    { name: 'Absent',    value: absencePct,         color: '#db2777' },
    { name: 'Available', value: 100 - absencePct,   color: '#e9d5ff' },
  ];
  const comparisonColors = ['#7c3aed', '#a5b4fc', '#c4b5fd'];
  const threshold = { green: 15, amber: 25, max: 40 };
  const greenEnd   = (threshold.green / threshold.max) * 100;
  const amberEnd   = (threshold.amber / threshold.max) * 100;
  const markerPos  = Math.min((absencePct / threshold.max) * 100, 99);

  const availableCount = team.filter(m => m.status === 'available').length;
  const absentCount    = team.filter(m => m.status === 'absent').length;

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

      {/* ── Section 1: My Team ────────────────────────────────────────── */}
      <Section title="My Team" accent="#7c3aed">
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14, alignItems: 'start' }}>

          {/* Team list */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            {/* Quick stats row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Available', value: availableCount, color: '#059669', bg: '#d1fae5' },
                { label: 'Absent',    value: absentCount,    color: '#dc2626', bg: '#fee2e2' },
                { label: 'Total',     value: team.length,    color: '#7c3aed', bg: '#ede9fe' },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, textAlign: 'center', padding: '8px 4px',
                  background: s.bg, borderRadius: 10,
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {team.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={member.initials} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.daysAbsent && (
                        <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>&gt;{member.daysAbsent}d </span>
                      )}
                      {member.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    background: member.status === 'available' ? '#d1fae5' : '#fee2e2',
                    color: member.status === 'available' ? '#065f46' : '#991b1b',
                  }}>
                    {member.status === 'available' ? 'Available' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => setShowModal(true)} style={{
              marginTop: 14, padding: '12px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              color: 'white', fontFamily: 'inherit', fontWeight: 700,
              fontSize: 13, cursor: 'pointer', width: '100%',
              boxShadow: '0 4px 14px rgba(124,58,237,0.35)', letterSpacing: '0.5px',
            }}>
              ✋ ESCALATE TO HR
            </button>
          </div>

          {/* Critical Staff */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Critical Staff</h3>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 14 }}>
              These team members are essential to operations — monitor their availability closely.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {criticalStaff.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)',
                }}>
                  <Avatar initials={s.initials} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: '#065f46',
                      background: '#d1fae5', padding: '1px 7px', borderRadius: 20,
                      display: 'inline-block', marginTop: 2,
                    }}>Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section 2: Absence Analytics ──────────────────────────────── */}
      <Section title="Absence Analytics" accent="#db2777">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, alignItems: 'start' }}>

          {/* Team Absence % donut */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4, textAlign: 'center' }}>
              Team Absence Today
            </h3>
            <div style={{ position: 'relative' }}>
              <ResponsiveContainer width="100%" height={155}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={65}
                    dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} formatter={v => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#db2777', lineHeight: 1 }}>{absencePct}%</div>
                <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>Absent</div>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', marginTop: 6 }}>
              {absentToday} of {totalTeam} team members absent
            </p>
          </div>

          {/* Threshold Management */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 16, textAlign: 'center' }}>
              Absence Threshold
            </h3>
            <div style={{ padding: '0 8px' }}>
              <div style={{ display: 'flex', marginBottom: 5, fontSize: 10, fontWeight: 700, color: '#6b7280' }}>
                <span style={{ flex: greenEnd, textAlign: 'center' }}>Green</span>
                <span style={{ flex: amberEnd - greenEnd, textAlign: 'center' }}>Amber</span>
                <span style={{ flex: 100 - amberEnd, textAlign: 'center' }}>Red</span>
              </div>
              <div style={{ display: 'flex', marginBottom: 8, fontSize: 9, color: '#9ca3af' }}>
                <span style={{ flex: greenEnd, textAlign: 'center' }}>0–15%</span>
                <span style={{ flex: amberEnd - greenEnd, textAlign: 'center' }}>16–25%</span>
                <span style={{ flex: 100 - amberEnd, textAlign: 'center' }}>26%+</span>
              </div>
              <div style={{ position: 'relative', height: 14, borderRadius: 7, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: greenEnd, background: '#10b981' }} />
                <div style={{ flex: amberEnd - greenEnd, background: '#f59e0b' }} />
                <div style={{ flex: 100 - amberEnd, background: '#ef4444' }} />
              </div>
              {/* Marker sits below, avoids overflow:hidden clipping */}
              <div style={{ position: 'relative', height: 12, marginTop: -7 }}>
                <div style={{
                  position: 'absolute', left: `${markerPos}%`,
                  transform: 'translateX(-50%)',
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#7c3aed', border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(124,58,237,0.5)',
                }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{absencePct}%</span>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Current rate — <strong style={{ color: '#f59e0b' }}>Amber</strong></div>
              </div>
              <button onClick={() => showToast('Threshold report submitted to HR for review.', 'info')} style={{
                width: '100%', marginTop: 14, padding: '9px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>
                Report to HR
              </button>
            </div>
          </div>

          {/* Absence Level Comparison */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textAlign: 'center' }}>
              Absence Level Comparison
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={comparisonData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                <XAxis dataKey="team" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={v => [`${v}%`, 'Absence']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="value" name="Absence" radius={[6,6,0,0]}>
                  {comparisonData.map((_, i) => <Cell key={i} fill={comparisonColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
              {comparisonData.map((d, i) => (
                <div key={d.team} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: comparisonColors[i] }}>{d.value}%</div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>{d.team}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section 3: Global Readiness ───────────────────────────────── */}
      <Section title="Global Readiness" accent="#2563eb">
        <div style={card}>
          <WorldMap sites={sites} title="World RAG Map" />
        </div>
      </Section>

      {showModal && <EscalateModal onClose={() => setShowModal(false)} showToast={showToast} />}
    </div>
  );
}
