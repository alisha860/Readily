import { useState, useRef, useEffect } from 'react';
import { USERS, avatarColor } from '../data';

const USER_LIST = [
  { id: 'hr',       label: 'Alex',    sublabel: 'HR Manager',  initials: 'A' },
  { id: 'teamlead', label: 'Melissa', sublabel: 'Team Lead',   initials: 'M' },
  { id: 'employee', label: 'Simone',  sublabel: 'Employee',    initials: 'S' },
];

function Avatar({ initials, size = 32, bg }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg || avatarColor(initials),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function Header({ user, currentUser, setCurrentUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentEntry = USER_LIST.find(u => u.id === currentUser);

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

        {/* Logo image */}
        <img
          src="/image.png"
          alt="Readily"
          style={{ height: 36, objectFit: 'contain', userSelect: 'none' }}
        />

        {/* User selector — centre */}
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
            {/* Chevron */}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', marginLeft: 2 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="#" onClick={e => e.preventDefault()}
            style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            help
          </a>
          <a href="#" onClick={e => e.preventDefault()}
            style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            portal
          </a>
          <Avatar initials={user.initials} size={36} bg={user.avatarBg} />
        </div>
      </div>
    </header>
  );
}
