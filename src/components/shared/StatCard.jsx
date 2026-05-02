// Two visual variants:
//   accent-border (HR KPIs): white card with coloured left border — omit `bg`
//   tinted (Team Lead KPIs): coloured background — pass `bg`
export function StatCard({ label, value, sub, color, bg }) {
  if (bg) {
    return (
      <div style={{
        background: bg, borderRadius: 16,
        boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
        border: `1px solid ${color}22`, padding: '14px 16px',
      }}>
        <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b', marginTop: 7 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>{sub}</div>}
      </div>
    );
  }
  return (
    <div style={{
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(10px)',
      borderRadius: 16,
      boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
      borderTop: '1px solid rgba(255,255,255,0.9)',
      borderRight: '1px solid rgba(255,255,255,0.9)',
      borderBottom: '1px solid rgba(255,255,255,0.9)',
      borderLeft: `3px solid ${color}`,
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
