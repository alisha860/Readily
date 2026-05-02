// tabs: [{ key, label, badge? }]
// badge > 0 shows a red count dot beside the label.
export function TabBar({ active, onChange, tabs }) {
  return (
    <div style={{
      display: 'flex', gap: 3, background: '#f3f4f6',
      borderRadius: 14, padding: 4, marginBottom: 24, width: 'fit-content',
    }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            padding: '9px 26px', borderRadius: 11, border: 'none',
            background: active === t.key ? 'white' : 'transparent',
            color: active === t.key ? '#1e1b4b' : '#9ca3af',
            fontFamily: 'inherit', fontWeight: active === t.key ? 700 : 500,
            fontSize: 13, cursor: 'pointer',
            boxShadow: active === t.key ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          {t.label}
          {t.badge > 0 && (
            <span style={{
              background: '#dc2626', color: 'white', fontSize: 9,
              fontWeight: 800, padding: '1px 5px', borderRadius: 20, lineHeight: 1.5,
            }}>{t.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
