import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import DeskMap from './DeskMap';
import { EMPLOYEE_DATA, HR_DATA, SITE_STATUS_COLORS, avatarColor } from '../data';

const card = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
  border: '1px solid rgba(255,255,255,0.9)',
  padding: 18,
};

const ANNOUNCEMENT_STYLES = {
  alert:   { bg: '#fff1f2', border: '#fecdd3', iconBg: '#fee2e2' },
  info:    { bg: '#f0f9ff', border: '#bae6fd', iconBg: '#e0f2fe' },
  warning: { bg: '#fffbeb', border: '#fde68a', iconBg: '#fef3c7' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7' },
};

const MY_STATS = {
  daysAbsentYear: 37,
  allowanceTotal: 50,
  allowanceUsed: 37,
  bradfordScore: 112,
  bradfordThreshold: 150,
  lastAbsence: '12/02/2025',
};

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

function TabBar({ active, onChange }) {
  const tabs = [
    { key: 'today',  label: 'Today'     },
    { key: 'record', label: 'My Record' },
  ];
  return (
    <div style={{ display: 'flex', gap: 3, background: '#f3f4f6', borderRadius: 14, padding: 4, marginBottom: 24, width: 'fit-content' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          padding: '9px 26px', borderRadius: 11, border: 'none',
          background: active === t.key ? 'white' : 'transparent',
          color: active === t.key ? '#1e1b4b' : '#9ca3af',
          fontFamily: 'inherit', fontWeight: active === t.key ? 700 : 500,
          fontSize: 13, cursor: 'pointer',
          boxShadow: active === t.key ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

export default function EmployeeDashboard({ user, showToast, absences, onAbsenceSubmit, onCancelAbsence, onWFHSubmit, isAbsent, isWFH, staffAnnouncements = [] }) {
  const { announcements: initialAnnouncements, myTeam, escalationContacts, absenceReasons, absenceDurations, monthlyAbsence, deskBooking } = EMPLOYEE_DATA;
  const mySite = HR_DATA.sites[0];

  const [activeTab, setActiveTab]     = useState('today');
  const [reportMode, setReportMode]   = useState('absence');
  const [reason, setReason]           = useState('');
  const [duration, setDuration]       = useState('');
  const [handover, setHandover]       = useState('');
  const [wfhNote, setWfhNote]         = useState('');
  const [dismissed, setDismissed]     = useState(new Set());
  const [localAnnouncements, setLocalAnnouncements] = useState(initialAnnouncements);

  // Merge HR-pushed announcements with local ones; filter dismissed
  const announcements = [...staffAnnouncements, ...localAnnouncements]
    .filter(a => !dismissed.has(a.id));

  const dismissAnnouncement = id => setDismissed(prev => new Set([...prev, id]));

  const handleSubmit = () => {
    if (!reason || !duration) { showToast('Please select a reason and duration.', 'warning'); return; }
    const today = new Date().toLocaleDateString('en-GB');
    const days = parseInt(duration) || 1;
    onAbsenceSubmit({ reason, duration: days, date: today });
    setLocalAnnouncements(prev => [{
      id: Date.now(), type: 'warning', icon: '🏠',
      text: `You reported an absence starting today: ${reason}, estimated ${duration}.`,
    }, ...prev]);
    showToast('Absence submitted. Your manager has been notified.', 'success');
    setReason(''); setDuration(''); setHandover('');
  };

  const handleWFH = () => {
    onWFHSubmit();
    setLocalAnnouncements(prev => [{
      id: Date.now(), type: 'info', icon: '🏠',
      text: `You logged as working from home today${wfhNote ? `: ${wfhNote}` : '.'}`,
    }, ...prev]);
    showToast('WFH status logged. Your team can see you are working remotely.', 'success');
    setWfhNote('');
  };

  const bradfordPct  = Math.min((MY_STATS.bradfordScore / MY_STATS.bradfordThreshold) * 100, 100);
  const allowancePct = Math.min((MY_STATS.allowanceUsed / MY_STATS.allowanceTotal) * 100, 100);

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

      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* ── TAB: TODAY ────────────────────────────────────────────────── */}
      {activeTab === 'today' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          {/* Site + team context strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            background: 'rgba(255,255,255,0.7)', border: '1px solid #e5e7eb',
            borderRadius: 10, padding: '8px 16px', marginBottom: 16,
          }}>
            {/* My site */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your site</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                background: `${SITE_STATUS_COLORS[mySite.status]}14`,
                border: `1px solid ${SITE_STATUS_COLORS[mySite.status]}40`,
                borderRadius: 20, padding: '2px 9px 2px 6px',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: SITE_STATUS_COLORS[mySite.status] }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{mySite.name}</span>
                <span style={{ fontSize: 11, color: SITE_STATUS_COLORS[mySite.status], fontWeight: 500, textTransform: 'capitalize' }}>{mySite.status}</span>
              </div>
            </div>
            <div style={{ width: 1, height: 18, background: '#e5e7eb' }} />
            {/* Team quick status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team</span>
              {myTeam.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.status === 'available' ? '#10b981' : '#ef4444' }} />
                  <span style={{ fontSize: 11, color: '#6b7280' }}>{m.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

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
                      <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4, flex: 1 }}>{a.text}</span>
                      <button
                        onClick={() => dismissAnnouncement(a.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#9ca3af', fontSize: 14, lineHeight: 1,
                          padding: '0 2px', flexShrink: 0,
                        }}
                        title="Dismiss"
                      >×</button>
                    </div>
                  );
                })}
              </div>

              {/* Prompt to My Record */}
              <div
                style={{
                  marginTop: 14, padding: '11px 14px', borderRadius: 12,
                  background: '#f8f7ff', border: '1px solid #e9d5ff', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                onClick={() => setActiveTab('record')}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>View my absence record</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>Bradford score, allowance, history</div>
                </div>
                <span style={{ fontSize: 16, color: '#c4b5fd' }}>→</span>
              </div>
            </div>

            {/* Report Today form */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>Report Today</h3>

              {(isAbsent || isWFH) ? (
                <div style={{
                  background: isWFH ? '#eef2ff' : '#fef3c7',
                  border: `1.5px solid ${isWFH ? '#c7d2fe' : '#fde68a'}`,
                  borderRadius: 10, padding: '14px 16px',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isWFH ? '#3730a3' : '#92400e' }}>
                    {isWFH ? 'Working from home today' : 'Absence already reported'}
                  </span>
                  <span style={{ fontSize: 11, color: isWFH ? '#4338ca' : '#78350f' }}>
                    {isWFH
                      ? 'Your team can see you are working remotely. No further action needed.'
                      : 'Your manager has been notified. Your absence is logged.'}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Mode toggle */}
                  <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 12, padding: 4, gap: 4 }}>
                    {[
                      { key: 'absence', label: 'Report Absence' },
                      { key: 'wfh',     label: 'Working from Home' },
                    ].map(m => (
                      <button key={m.key} onClick={() => setReportMode(m.key)} style={{
                        flex: 1, padding: '8px', borderRadius: 9, border: 'none',
                        background: reportMode === m.key ? 'white' : 'transparent',
                        color: reportMode === m.key ? '#1e1b4b' : '#9ca3af',
                        fontFamily: 'inherit', fontWeight: reportMode === m.key ? 700 : 500,
                        fontSize: 12, cursor: 'pointer',
                        boxShadow: reportMode === m.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s',
                      }}>{m.label}</button>
                    ))}
                  </div>

                  {reportMode === 'absence' ? (
                    <>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Absence Reason</label>
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
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Estimated Duration</label>
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
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Handover Information</label>
                        <textarea value={handover} onChange={e => setHandover(e.target.value)}
                          placeholder="Describe handover notes for your team…"
                          style={{
                            width: '100%', padding: '9px 12px', borderRadius: 10,
                            border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                            fontSize: 12, outline: 'none', resize: 'none',
                            height: 72, lineHeight: 1.5, color: '#374151',
                          }} />
                      </div>
                      <button onClick={handleSubmit} style={{
                        padding: '11px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                        color: 'white', fontFamily: 'inherit', fontWeight: 700,
                        fontSize: 13, cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                      }}>Submit Absence</button>
                    </>
                  ) : (
                    <>
                      <div style={{
                        background: '#eef2ff', borderRadius: 10, padding: '12px 14px',
                        border: '1.5px solid #c7d2fe', fontSize: 12, color: '#3730a3', lineHeight: 1.5,
                      }}>
                        Logging WFH notifies your team you are working remotely. No absence is recorded.
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                          Note for your team <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea value={wfhNote} onChange={e => setWfhNote(e.target.value)}
                          placeholder="e.g. Available on Teams all day, back in office tomorrow…"
                          style={{
                            width: '100%', padding: '9px 12px', borderRadius: 10,
                            border: '1.5px solid #e5e7eb', fontFamily: 'inherit',
                            fontSize: 12, outline: 'none', resize: 'none',
                            height: 72, lineHeight: 1.5, color: '#374151',
                          }} />
                      </div>
                      <button onClick={handleWFH} style={{
                        padding: '11px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white', fontFamily: 'inherit', fontWeight: 700,
                        fontSize: 13, cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                      }}>Log WFH Today</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desk area */}
          {deskBooking && (
            <div style={{ ...card, marginTop: 20 }}>
              <DeskMap booking={deskBooking} isWFH={isWFH} showToast={showToast} />
            </div>
          )}
        </div>
      )}

      {/* ── TAB: MY RECORD ────────────────────────────────────────────── */}
      {activeTab === 'record' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, alignItems: 'start', marginBottom: 14 }}>

            {/* Absence overview stats */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>My Absence Overview</h3>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>Your absence totals, allowance, and review indicators for this year</p>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Days This Year', value: MY_STATS.daysAbsentYear, color: '#db2777', bg: '#fce7f3' },
                  { label: 'Remaining',      value: MY_STATS.allowanceTotal - MY_STATS.allowanceUsed, color: '#059669', bg: '#d1fae5' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '10px', borderRadius: 12, background: s.bg, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
                Last absence: <strong style={{ color: '#6b7280' }}>{MY_STATS.lastAbsence}</strong>
              </div>
            </div>

            {/* Absence history */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>My Absence History</h3>
              {absences.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, paddingTop: 20 }}>No absences recorded</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Date', 'Duration', 'Reason', ''].map(h => (
                        <th key={h} style={{
                          textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9ca3af',
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                          paddingBottom: 10, borderBottom: '1px solid #f3f4f6',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {absences.map((ab, i) => {
                      const isMedical = ['Sickness', 'Covid'].includes(ab.reason);
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                          <td style={{ padding: '10px 0', fontSize: 12, color: '#374151', fontWeight: 500 }}>{ab.date}</td>
                          <td style={{ padding: '10px 0', fontSize: 12, color: '#374151' }}>{ab.duration} Days</td>
                          <td style={{ padding: '10px 0' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                              background: isMedical ? '#fee2e2' : '#f3f4f6',
                              color: isMedical ? '#991b1b' : '#374151',
                            }}>{ab.reason}</span>
                          </td>
                          <td style={{ padding: '10px 0', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                onCancelAbsence(i);
                                showToast('Absence record withdrawn.', 'info');
                              }}
                              style={{
                                fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 7,
                                border: '1.5px solid #e5e7eb', background: 'white',
                                color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.12s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#9ca3af'; }}
                            >Withdraw</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Monthly absence chart */}
          <div style={{ ...card, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Monthly Absence This Year</h3>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>Days absent per calendar month</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#db2777', background: '#fce7f3', padding: '3px 10px', borderRadius: 20 }}>
                {monthlyAbsence.reduce((s, m) => s + m.days, 0)} days total
              </span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyAbsence} barCategoryGap="30%" margin={{ top: 0, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => [`${v} days`, 'Absent']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                  {monthlyAbsence.map((m, i) => (
                    <Cell key={i} fill={m.days === 0 ? '#e5e7eb' : m.days > 10 ? '#f472b6' : '#c4b5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Team + Contacts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* My Team */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>Team Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {myTeam.map(m => (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.08)',
                  }}>
                    <Avatar initials={m.initials} size={36} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: m.status === 'absent' ? '#9ca3af' : '#1e1b4b' }}>{m.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.status === 'available' ? '#10b981' : '#ef4444' }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: m.status === 'available' ? '#059669' : '#dc2626' }}>
                        {m.status === 'available' ? 'In' : 'Out'}
                      </span>
                    </div>
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
                        background: '#d1fae5', color: '#059669', fontWeight: 600,
                        textDecoration: 'none', flexShrink: 0,
                      }}>
                      Email
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
