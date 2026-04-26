const STYLES = {
  success: { bg: '#f0fdf4', border: '#10b981', text: '#065f46', icon: '✓' },
  error:   { bg: '#fff1f2', border: '#ef4444', text: '#991b1b', icon: '✕' },
  info:    { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: 'ℹ' },
  warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '!' },
};

export default function Toast({ message, type = 'info', onClose }) {
  const s = STYLES[type] || STYLES.info;
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: s.bg, border: `2px solid ${s.border}`,
      borderRadius: 14, padding: '14px 18px',
      color: s.text, fontWeight: 600, fontSize: 14,
      maxWidth: 340, boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'toastIn 0.3s ease', fontFamily: 'inherit',
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: '50%', background: s.border,
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}>{s.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: s.text, fontSize: 20, lineHeight: 1, opacity: 0.6, padding: 0,
      }}>×</button>
    </div>
  );
}
