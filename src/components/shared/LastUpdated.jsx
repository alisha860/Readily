// Small "Updated HH:MM" timestamp shown in the KPI strip area.
export function LastUpdated() {
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>Updated {time}</span>
  );
}
