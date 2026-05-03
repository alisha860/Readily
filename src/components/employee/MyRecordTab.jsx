import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { card, Avatar } from '../shared';
import { EMPLOYEE_DATA } from '../../data';

// Static stats for Simone's current year — displayed in Absence Overview.
const MY_STATS = {
  daysAbsentYear: 37,
  allowanceTotal: 50,
  allowanceUsed: 37,
  lastAbsence: '14/04/2026',
};

// Static current status — shown in the Current Status card below Absence History.
const CURRENT_STATUS = {
  status: 'absent',
  reason: 'Sickness',
  daysRemaining: 3,
  expectedReturn: '4th January 2026',
};

export default function MyRecordTab({ absences, onCancelAbsence, showToast, isAbsent, isWFH }) {
  const { myTeam, escalationContacts, monthlyAbsence } = EMPLOYEE_DATA;
  const allowancePct = Math.min((MY_STATS.allowanceUsed / MY_STATS.allowanceTotal) * 100, 100);

  // Derive live status — prefer the real isAbsent/isWFH state over the static default.
  const liveStatus = isAbsent ? 'absent' : isWFH ? 'wfh' : 'available';
  const statusLabel  = { absent: 'Currently Absent', wfh: 'Working from Home', available: 'Currently Active' };
  const statusColor  = { absent: '#dc2626', wfh: '#6366f1', available: '#059669' };

  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>

      {/* Top section: 2-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, alignItems: 'start', marginBottom: 14 }}>

        {/* LEFT: Absence History + Current Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Absence History */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>My Absence History</h3>
            {absences.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, paddingTop: 20 }}>No absences recorded</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['DATE', 'DURATION', 'REASON', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: 10, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {absences.map((ab, i) => {
                    const isMedical = ['Sickness', 'Covid'].includes(ab.reason);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                        <td style={{ padding: '10px 0', fontSize: 12, color: '#374151', fontWeight: 500 }}>{ab.date}</td>
                        <td style={{ padding: '10px 0', fontSize: 12, color: '#374151' }}>{ab.duration} days</td>
                        <td style={{ padding: '10px 0' }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: isMedical ? '#fee2e2' : '#f3f4f6', color: isMedical ? '#991b1b' : '#374151' }}>{ab.reason}</span>
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right' }}>
                          <button
                            onClick={() => { onCancelAbsence(i); showToast('Absence record withdrawn.', 'info'); }}
                            style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 7, border: '1.5px solid #e5e7eb', background: 'white', color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}
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

          {/* Current Status */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 10 }}>Current Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: statusColor[liveStatus] }}>{statusLabel[liveStatus]}</div>
              {liveStatus === 'absent' && (
                <>
                  <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>
                    {CURRENT_STATUS.reason}: {CURRENT_STATUS.daysRemaining} days remaining
                  </div>
                  <div style={{ fontSize: 12, color: '#d97706' }}>
                    Expected Return Date: {CURRENT_STATUS.expectedReturn}
                  </div>
                </>
              )}
              {liveStatus === 'wfh' && (
                <div style={{ fontSize: 12, color: '#6366f1' }}>Working remotely today — team has been notified.</div>
              )}
              {liveStatus === 'available' && (
                <div style={{ fontSize: 12, color: '#059669' }}>In office — no action needed.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Absence Overview + Escalation Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Absence Overview */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>Absence Overview</h3>

            {/* Absence Allowance bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b' }}>Absence Allowance</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0891b2' }}>{MY_STATS.allowanceUsed} / {MY_STATS.allowanceTotal} days</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${allowancePct}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #0891b2, #06b6d4)', transition: 'width 0.8s ease' }} />
              </div>
            </div>

            {/* Metric tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
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

            {/* View detailed metrics CTA */}
            <button
              onClick={() => showToast('Detailed metrics view coming soon.', 'info')}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #0891b2', background: 'white', color: '#0891b2', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e0f7fa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
            >View detailed metrics</button>
          </div>

          {/* Escalation Contacts */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Escalation Contacts</h3>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>Contact in priority order</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {escalationContacts.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <Avatar initials={c.initials} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{c.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: '#d1fae5', color: '#059669' }}>{c.role}</span>
                    </div>
                    <a href={`tel:${c.phone}`} style={{ fontSize: 10, color: '#6b7280', display: 'block', textDecoration: 'none', fontWeight: 500 }}>{c.phone}</a>
                  </div>
                  <a
                    href={`mailto:${c.email}`}
                    onClick={e => { e.preventDefault(); showToast(`Email drafted to ${c.name}.`, 'info'); }}
                    style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, background: '#d1fae5', color: '#059669', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
                  >Email</a>
                </div>
              ))}
            </div>
          </div>
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
            <Bar dataKey="days" radius={[4,4,0,0]}>
              {monthlyAbsence.map((m, i) => <Cell key={i} fill={m.days === 0 ? '#e5e7eb' : m.days > 10 ? '#f472b6' : '#c4b5fd'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Team Status */}
      <div style={card}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>Team Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {myTeam.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.08)' }}>
              <Avatar initials={m.initials} size={36} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: m.status === 'absent' ? '#9ca3af' : '#1e1b4b' }}>{m.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.status === 'available' ? '#10b981' : '#ef4444' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: m.status === 'available' ? '#059669' : '#dc2626' }}>{m.status === 'available' ? 'In' : 'Out'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
