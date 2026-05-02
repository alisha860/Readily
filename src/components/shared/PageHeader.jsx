// "Good morning, {name}" section at the top of each dashboard view.
export function PageHeader({ name, subtitle }) {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>{date}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
          Good morning, {name}
        </h1>
        {subtitle && (
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{subtitle}</span>
        )}
      </div>
    </div>
  );
}
