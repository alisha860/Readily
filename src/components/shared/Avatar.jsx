import { avatarColor } from '../../data';

/** Circular avatar with auto-coloured background derived from initials. */
export function Avatar({ initials, size = 32, bg }) {
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
