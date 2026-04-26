const MODES = [
  { id: 'hr', label: 'HR Mode' },
  { id: 'teamlead', label: 'Team Lead Mode' },
  { id: 'employee', label: 'Employee Mode' },
];

export default function Header({ user, currentUser, setCurrentUser }) {
  return (
    <header style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(124,58,237,0.1)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 62,
        maxWidth: 1600, margin: '0 auto',
      }}>
        {/* Logo */}
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', userSelect: 'none' }}>
          <span style={{ color: '#0891b2' }}>read</span>
          <span style={{ color: '#7c3aed' }}>ily</span>
        </div>

        {/* Mode label */}
        <span style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>
          {user.mode}
        </span>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="#" style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
            onClick={e => e.preventDefault()}>help</a>
          <a href="#" style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
            onClick={e => e.preventDefault()}>portal</a>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: user.avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            {user.initials}
          </div>
        </div>
      </div>

      {/* Mode switcher */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 28px 12px',
        maxWidth: 1600, margin: '0 auto',
      }}>
        {MODES.map(m => {
          const active = currentUser === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setCurrentUser(m.id)}
              style={{
                padding: '5px 18px', borderRadius: 20, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, fontWeight: active ? 700 : 500,
                background: active ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'rgba(124,58,237,0.07)',
                color: active ? 'white' : '#7c3aed',
                transition: 'all 0.18s ease',
                boxShadow: active ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
