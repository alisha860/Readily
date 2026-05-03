import { useState, useRef, useEffect } from 'react';
import { USERS } from '../data';
import { ROLE_DEFAULTS, getTheme } from '../themes';
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

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5"  r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5"  cy="7.5"  r="0.5" fill="currentColor" />
      <circle cx="6.5"  cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: 6, borderRadius: 8,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--c-text-2)',
  transition: 'background 0.12s, color 0.12s',
};

export default function Header({
  user, currentUser, setCurrentUser,
  notifications = [], markNotificationsRead,
  userThemes, setUserTheme, allThemes,
}) {
  const [open,      setOpen]      = useState(false);
  const [bellOpen,  setBellOpen]  = useState(false);
  const [helpOpen,  setHelpOpen]  = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const ref      = useRef(null);
  const bellRef  = useRef(null);
  const helpRef  = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current      && !ref.current.contains(e.target))      setOpen(false);
      if (bellRef.current  && !bellRef.current.contains(e.target))  setBellOpen(false);
      if (helpRef.current  && !helpRef.current.contains(e.target))  setHelpOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifications.filter(n => !n.read).length;
  const currentEntry = USER_LIST.find(u => u.id === currentUser);

  function handleBellOpen() {
    setBellOpen(o => !o);
    if (!bellOpen && unread > 0) markNotificationsRead?.();
  }

  const panel = {
    position: 'absolute', top: 'calc(100% + 8px)',
    background: 'var(--c-surface)',
    borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid var(--accent-a12)',
    zIndex: 200,
  };

  return (
    <header style={{
      background: 'var(--c-header)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--accent-a10)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 64,
        maxWidth: 1600, margin: '0 auto',
      }}>

        {/* Logo */}
        <img src="/image.png" alt="Readily"
          style={{ height: 36, objectFit: 'contain', userSelect: 'none' }} />

        {/* User selector */}
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 14px 7px 8px',
              borderRadius: 40, border: '1.5px solid var(--accent-a20)',
              background: open ? 'var(--accent-a06)' : 'var(--accent-a04)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s ease',
              boxShadow: open ? '0 0 0 3px var(--accent-a10)' : 'none',
            }}
          >
            <Avatar initials={currentEntry.initials} size={30} bg={user.avatarBg} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', lineHeight: 1.2 }}>
                {currentEntry.label}
              </div>
              <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>
                {currentEntry.sublabel}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: 2 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <div style={{
              ...panel,
              left: '50%', transform: 'translateX(-50%)',
              padding: 6, minWidth: 210,
              animation: 'slideUp 0.15s ease',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.6px',
                padding: '6px 10px 4px',
              }}>Switch User</p>
              {USER_LIST.map(u => {
                const active  = u.id === currentUser;
                const uTheme  = getTheme(userThemes?.[u.id] ?? ROLE_DEFAULTS[u.id]);
                return (
                  <button
                    key={u.id}
                    onClick={() => { setCurrentUser(u.id); setOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '9px 10px',
                      borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left',
                      background: active ? 'var(--accent-a08)' : 'transparent',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--accent-a04)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Avatar initials={u.initials} size={34} bg={uTheme.avatarBg} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>{u.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>{u.sublabel}</div>
                    </div>
                    {active && (
                      <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

          {/* Help */}
          <div ref={helpRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setHelpOpen(o => !o)}
              style={{ ...iconBtn, padding: '6px 10px', fontSize: 13, fontWeight: 500, color: helpOpen ? 'var(--accent)' : '#6b7280' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-a06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              help
            </button>
            {helpOpen && (
              <div style={{ ...panel, right: -70, width: 280, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 12 }}>Quick Guide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'hr',       icon: '👩‍💼', title: 'HR Manager', items: [
                      'Overview — KPIs, risk alerts, department coverage',
                      'Deploy reserve staff to understaffed departments',
                      'Alert Staff — push announcements to all employees',
                      'Analyse — absence trends, site map, workforce split',
                      'Reports — configure and download workforce reports',
                    ]},
                    { id: 'teamlead', icon: '👤', title: 'Team Lead', items: [
                      'My Team — absences, critical roles, weekly schedule',
                      'Escalate to HR when thresholds are breached',
                      'Analytics — absence rate, team comparison, trends',
                    ]},
                    { id: 'employee', icon: '🙋', title: 'Employee', items: [
                      'Today — report absence or log WFH; manager notified',
                      'Site Overview — current bay and desk availability',
                      'My Record — allowance, history, contacts',
                    ]},
                  ].map(role => {
                    const isActive = currentUser === role.id;
                    return (
                      <div key={role.id} style={{
                        borderRadius: 10, padding: '8px 10px',
                        background: isActive ? 'var(--accent-a06)' : '#f9fafb',
                        border: `1px solid ${isActive ? 'var(--accent-a20)' : 'transparent'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          <span style={{ fontSize: 13 }}>{role.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: isActive ? 'var(--accent)' : '#374151' }}>{role.title}</span>
                          {isActive && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-a10)', padding: '1px 6px', borderRadius: 10 }}>You</span>}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {role.items.map(item => (
                            <li key={item} style={{ fontSize: 11, color: isActive ? '#4b5563' : '#9ca3af', lineHeight: 1.4 }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setHelpOpen(false)}
                  style={{
                    marginTop: 12, width: '100%', padding: '8px 10px', borderRadius: 9,
                    border: '1px solid var(--accent-a20)', background: 'var(--accent-a04)',
                    color: 'var(--accent)', fontFamily: 'inherit', fontSize: 11,
                    fontWeight: 800, cursor: 'pointer',
                  }}
                >Got it</button>
              </div>
            )}
          </div>

          {/* Theme picker */}
          <div ref={themeRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setThemeOpen(o => !o)}
              title="Choose theme"
              style={{ ...iconBtn, color: themeOpen ? 'var(--accent)' : '#6b7280' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-a06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <PaletteIcon />
            </button>

            {themeOpen && (
              <div style={{
                ...panel,
                right: 0, padding: '14px 16px', minWidth: 220,
                animation: 'slideUp 0.15s ease',
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, color: '#9ca3af',
                  textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12,
                }}>Theme</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {allThemes.map(t => {
                    const isActive = (userThemes?.[currentUser] ?? ROLE_DEFAULTS[currentUser]) === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setUserTheme(t.id); setThemeOpen(false); }}
                        title={t.name}
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: t.avatarBg,
                          border: isActive ? '3px solid #1e1b4b' : '3px solid transparent',
                          outline: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                          outlineOffset: 2,
                          cursor: 'pointer', padding: 0,
                          transition: 'transform 0.15s',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    );
                  })}
                </div>
                <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 10, lineHeight: 1.4 }}>
                  Changes your avatar colour and page background.
                </p>
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              onClick={handleBellOpen}
              style={{ ...iconBtn, position: 'relative', color: bellOpen ? 'var(--accent)' : '#6b7280' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-a06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                }}>{unread > 9 ? '9+' : unread}</span>
              )}
            </button>

            {bellOpen && (
              <div style={{ ...panel, right: 0, minWidth: 300, maxWidth: 360, overflow: 'hidden' }}>
                <div style={{
                  padding: '12px 16px 8px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>Notifications</span>
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
