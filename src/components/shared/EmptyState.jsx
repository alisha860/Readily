// Centred empty-state block used when a list or table has no rows.
export function EmptyState({ title, message, color = '#059669', bg = '#f0fdf4', border = '#bbf7d0' }) {
  return (
    <div style={{
      padding: '20px 16px', borderRadius: 12,
      background: bg, border: `1px solid ${border}`, textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color }}>{title}</div>
      {message && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{message}</div>}
    </div>
  );
}
