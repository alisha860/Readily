// ── Formatting utilities ──────────────────────────────────────────────────

/** Human-readable time-ago string, used in notification lists. */
export function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

/** Full date string e.g. "Thursday, 1st January 2026". */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** HH:MM time string in 24-hour format. */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
