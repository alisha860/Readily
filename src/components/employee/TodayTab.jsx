import { card } from '../shared';
import { EMPLOYEE_DATA } from '../../data';

const DESK_MAP = {
  A: ['closed', 'present', 'present', 'present', 'closed', 'closed', 'closed', 'remote'],
  B: ['present', 'closed', 'closed', 'present', 'present', 'remote', 'closed', 'present'],
  C: ['remote',  'closed', 'yours',  'remote',  'closed',  'closed', 'present', 'closed'],
};

const DESK_STYLES = {
  present: { bg: '#dcfce7', border: '#16a34a', color: '#15803d' },
  closed:  { bg: '#fef3c7', border: '#d97706', color: '#92400e' },
  remote:  { bg: '#dbeafe', border: '#93c5fd', color: '#1d4ed8' },
  yours:   { bg: '#ffffff', border: '#ec4899', color: '#ec4899' },
  empty:   { bg: '#ffffff', border: '#e5e7eb', color: '#9ca3af' },
};

// Background tint per announcement type.
const ANNOUNCEMENT_STYLES = {
  alert:   { bg: '#fff1f2', border: '#fecdd3', iconBg: '#fee2e2' },
  info:    { bg: '#f0f9ff', border: '#bae6fd', iconBg: '#e0f2fe' },
  warning: { bg: '#fffbeb', border: '#fde68a', iconBg: '#fef3c7' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7' },
};

export default function TodayTab({
  isAbsent, isWFH,
  announcements, dismissAnnouncement,
  reportMode, setReportMode,
  reason, setReason,
  duration, setDuration,
  handover, setHandover,
  wfhNote, setWfhNote,
  onSubmitAbsence, onSubmitWFH,
  setActiveTab,
  showToast,
}) {
  const { myTeam, absenceReasons, absenceDurations } = EMPLOYEE_DATA;

  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>
      {/* Site + team context strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.7)', border: '1px solid #e5e7eb',
        borderRadius: 10, padding: '8px 16px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your site</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fef3c714', border: '1px solid #d97706', borderRadius: 20, padding: '2px 9px 2px 6px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>London</span>
            <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500 }}>Partial</span>
          </div>
        </div>
        <div style={{ width: 1, height: 18, background: '#e5e7eb' }} />
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Announcements */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>Announcements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {announcements.map(a => {
              const s = ANNOUNCEMENT_STYLES[a.type] || ANNOUNCEMENT_STYLES.info;
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '8px 10px' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4, flex: 1 }}>{a.text}</span>
                  <button onClick={() => dismissAnnouncement(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14, lineHeight: 1, padding: '0 2px', flexShrink: 0 }} title="Dismiss">×</button>
                </div>
              );
            })}
          </div>
          {/* Prompt to My Record */}
          <div onClick={() => setActiveTab('record')} style={{ marginTop: 14, padding: '11px 14px', borderRadius: 12, background: '#f8f7ff', border: '1px solid #e9d5ff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <div style={{ background: isWFH ? '#eef2ff' : '#fef3c7', border: `1.5px solid ${isWFH ? '#c7d2fe' : '#fde68a'}`, borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isWFH ? '#3730a3' : '#92400e' }}>{isWFH ? 'Working from home today' : 'Absence already reported'}</span>
              <span style={{ fontSize: 11, color: isWFH ? '#4338ca' : '#78350f' }}>
                {isWFH ? 'Your team can see you are working remotely. No further action needed.' : 'Your manager has been notified. Your absence is logged.'}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Mode toggle */}
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 12, padding: 4, gap: 4 }}>
                {[{ key: 'absence', label: 'Report Absence' }, { key: 'wfh', label: 'Working from Home' }].map(m => (
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
                    <select value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 13, outline: 'none', background: 'white', color: reason ? '#1e1b4b' : '#9ca3af' }}>
                      <option value="">Select reason…</option>
                      {absenceReasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Estimated Duration</label>
                    <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 13, outline: 'none', background: 'white', color: duration ? '#1e1b4b' : '#9ca3af' }}>
                      <option value="">Select duration…</option>
                      {absenceDurations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Handover Notes</label>
                    <textarea value={handover} onChange={e => setHandover(e.target.value)} placeholder="Describe handover notes for your team…" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 12, outline: 'none', resize: 'none', height: 72, lineHeight: 1.5, color: '#374151' }} />
                  </div>
                  <button onClick={onSubmitAbsence} style={{ padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #0891b2, #0e7490)', color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.35)' }}>
                    Submit Absence
                  </button>
                </>
              ) : (
                <>
                  <div style={{ background: '#eef2ff', borderRadius: 10, padding: '12px 14px', border: '1.5px solid #c7d2fe', fontSize: 12, color: '#3730a3', lineHeight: 1.5 }}>
                    Logging WFH notifies your team you are working remotely. No absence is recorded.
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                      Note for your team <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <textarea value={wfhNote} onChange={e => setWfhNote(e.target.value)} placeholder="e.g. Available on Teams all day, back in office tomorrow…" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 12, outline: 'none', resize: 'none', height: 72, lineHeight: 1.5, color: '#374151' }} />
                  </div>
                  <button onClick={onSubmitWFH} style={{ padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                    Log WFH Today
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Site Overview — desk map */}
      <div style={{ ...card, marginTop: 14 }}>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Site Overview</h3>
          <p style={{ fontSize: 11, color: '#6b7280' }}>London - Team Bay A</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ padding: '9px 14px', borderRadius: 10, background: '#d1fae5', border: '1px solid #6ee7b7', textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>15 Present</span>
          </div>
          <div style={{ padding: '9px 14px', borderRadius: 10, background: '#fef3c7', border: '1px solid #fcd34d', textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>14 Desks Closed</span>
          </div>
          <div style={{ padding: '9px 14px', borderRadius: 10, background: '#dbeafe', border: '1px solid #93c5fd', textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>3 Remote</span>
          </div>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <span style={{ fontSize: 13 }}>⚠️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Status: Reduced Capacity</span>
        </div>
        <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 16 }}>View current on-site presence and availability</p>

        {/* Desk rows */}
        {Object.entries(DESK_MAP).map(([row, desks]) => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', width: 14, flexShrink: 0 }}>{row}</span>
            {desks.map((status, i) => {
              const label = `${row}${i + 1}`;
              const s = DESK_STYLES[status] || DESK_STYLES.empty;
              return (
                <div key={label} style={{
                  flex: 1, height: 36, borderRadius: 8,
                  background: s.bg, border: `1.5px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{label}</span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #ec4899', background: 'white', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#6b7280' }}>Your Allocation</span>
        </div>
      </div>
    </div>
  );
}
