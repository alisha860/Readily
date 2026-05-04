import { useState, useRef, useEffect } from 'react';
import { USERS } from '../data';
import { Avatar } from './shared';

const USER_LIST = [
  { id: 'hr',       label: 'Alex',    sublabel: 'HR Manager',  initials: 'A' },
  { id: 'teamlead', label: 'Melissa', sublabel: 'Team Lead',   initials: 'M' },
  { id: 'employee', label: 'Simone',  sublabel: 'Employee',    initials: 'S' },
];

const TYPE_COLORS = {
  info:    { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
  warning: { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  success: { bg: '#f0fdf4', text: '#059669', dot: '#10b981' },
  error:   { bg: '#fff1f2', text: '#dc2626', dot: '#ef4444' },
};

// Formats notification timestamps as relative time (e.g. "3m ago") so users
// can quickly judge how recent each alert is.
function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function Header({ user, currentUser, setCurrentUser, notifications = [], markNotificationsRead }) {
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const ref = useRef(null);
  const bellRef = useRef(null);
  const helpRef = useRef(null);

  // Closes any open dropdown when the user clicks elsewhere on the page,
  // preventing multiple panels from being open simultaneously.
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (helpRef.current && !helpRef.current.contains(e.target)) setHelpOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Unread count drives the red badge on the bell icon so users immediately
  // know when new notifications have arrived without opening the panel.
  const unread = notifications.filter(n => !n.read).length;
  const currentEntry = USER_LIST.find(u => u.id === currentUser);

  // Marks all notifications as read when the bell is opened, clearing the
  // unread badge so the user knows they have seen the latest alerts.
  function handleBellOpen() {
    setBellOpen(o => !o);
    if (!bellOpen && unread > 0) markNotificationsRead?.();
  }

  return (
    <header style={{
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(124,58,237,0.1)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 64,
        maxWidth: 1600, margin: '0 auto',
      }}>

        {/* Logo */}
        <img
          src="/image.png"
          alt="Readily"
          style={{ height: 36, objectFit: 'contain', userSelect: 'none' }}
        />

        {/* User selector */}
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 14px 7px 8px',
              borderRadius: 40, border: '1.5px solid rgba(124,58,237,0.2)',
              background: open ? 'rgba(124,58,237,0.06)' : 'rgba(124,58,237,0.04)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s ease',
              boxShadow: open ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
            }}
          >
            <Avatar initials={currentEntry.initials} size={30} bg={user.avatarBg} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', lineHeight: 1.2 }}>
                {currentEntry.label}
              </div>
              <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 500 }}>
                {currentEntry.sublabel}
              </div>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', marginLeft: 2 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
              transform: 'translateX(-50%)',
              background: 'white', borderRadius: 14,
              boxShadow: '0 8px 32px rgba(30,27,75,0.15), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(124,58,237,0.12)',
              padding: 6, minWidth: 210,
              animation: 'slideUp 0.15s ease',
              zIndex: 200,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '6px 10px 4px' }}>
                Switch User
              </p>
              {USER_LIST.map(u => {
                const active = u.id === currentUser;
                const uData = USERS[u.id];
                return (
                  <button
                    key={u.id}
                    onClick={() => { setCurrentUser(u.id); setOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '9px 10px',
                      borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left',
                      background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(124,58,237,0.04)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Avatar initials={u.initials} size={34} bg={uData.avatarBg} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>{u.label}</div>
                      <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 500 }}>{u.sublabel}</div>
                    </div>
                    {active && (
                      <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div ref={helpRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setHelpOpen(o => !o)}
              style={{
                color: helpOpen ? '#7c3aed' : '#6b7280',
                fontSize: 13,
                fontWeight: 500,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              help
            </button>
            {helpOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', right: -70,
                width: 300, background: 'white', borderRadius: 14,
                boxShadow: '0 8px 32px rgba(30,27,75,0.15), 0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(124,58,237,0.12)',
                padding: 16, zIndex: 220,
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>
                  Help Centre
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    {
                      title: 'HR Manager',
                      items: [
                        'Overview tab — live KPIs, readiness score, risk management, and department coverage.',
                        'Click "Deploy Reserve" on any department below minimum staffing to assign staff.',
                        'Use the Alert Staff panel to push announcements to all employees.',
                        'Analyse tab — filter by department or period, view absence trends and the world map.',
                        'Reports tab — configure and download workforce reports for leadership.',
                        'Escalations from team leads appear in the Overview tab for review.',
                      ],
                    },
                    {
                      title: 'Team Lead',
                      items: [
                        'My Team tab — see today\’s absences, critical-role coverage, and the weekly schedule.',
                        'Click "Escalate to HR" when absence levels exceed thresholds or critical roles are uncovered.',
                        'Analytics tab — track absence rate vs threshold, compare with other teams, and view trends.',
                        'The weekly schedule grid shows each team member\’s office, WFH, leave, or absence plan.',
                        'Filter the schedule by location (London, New York, Dubai).',
                      ],
                    },
                    {
                      title: 'Employee',
                      items: [
                        'Today tab — report an absence or log a WFH day using the form on the right.',
                        'Select a reason and estimated duration; your manager is notified automatically.',
                        'Dismiss announcements from HR using the × button.',
                        'Use the desk map to see floor occupancy and book a desk for tomorrow.',
                        'My Record tab — view Bradford factor, absence allowance, and full absence history.',
                        'Withdraw a past absence record using the Withdraw button in the history table.',
                      ],
                    },
                  ].map(role => (
                    <div key={role.title} style={{ paddingBottom: 8, borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', marginBottom: 4 }}>{role.title}</div>
                      <ul style={{ margin: 0, paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {role.items.map(item => (
                          <li key={item} style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.45 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setHelpOpen(false)}
                  style={{
                    marginTop: 12, width: '100%', padding: '8px 10px', borderRadius: 9,
                    border: '1px solid #e9d5ff', background: '#f8f7ff',
                    color: '#7c3aed', fontFamily: 'inherit', fontSize: 11,
                    fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  Got it
                </button>
              </div>
            )}
          </div>
          {/* Notification bell */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              onClick={handleBellOpen}
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', padding: 6, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={bellOpen ? '#7c3aed' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  background: '#dc2626', color: 'white',
                  borderRadius: '50%', width: 16, height: 16,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white',
                }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {bellOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'white', borderRadius: 14,
                boxShadow: '0 8px 32px rgba(30,27,75,0.15), 0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(124,58,237,0.12)',
                minWidth: 300, maxWidth: 360,
                zIndex: 200, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px 8px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>Notifications</span>
                  {notifications.length > 0 && (
                    <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 500 }}>
                      {notifications.filter(n => !n.read).length > 0 ? 'All read' : ''}
                    </span>
                  )}
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => {
                      const tc = TYPE_COLORS[n.type] || TYPE_COLORS.info;
                      return (
                        <div key={n.id} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '10px 16px',
                          background: n.read ? 'white' : 'rgba(124,58,237,0.03)',
                          borderBottom: '1px solid #f9fafb',
                        }}>
                          <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: tc.dot, flexShrink: 0, marginTop: 4,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.4 }}>
                              {n.message}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                              {timeAgo(n.time)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <Avatar initials={user.initials} size={36} bg={user.avatarBg} />
        </div>
      </div>
    </header>
  );
}
