// RAG label badge — always shows text alongside colour for accessibility.
export function StatusBadge({ status }) {
  const styles = {
    Stable:   { bg: '#d1fae5', text: '#065f46' },
    Warning:  { bg: '#fef3c7', text: '#92400e' },
    Critical: { bg: '#fee2e2', text: '#991b1b' },
    Monitor:  { bg: '#dbeafe', text: '#1e40af' },
  };
  const s = styles[status] || styles.Monitor;
  return (
    <span style={{
      background: s.bg, color: s.text,
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
    }}>
      {status}
    </span>
  );
}
