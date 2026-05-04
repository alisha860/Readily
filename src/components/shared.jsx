// shared.jsx: reusable UI components used across all three dashboard roles
import { useState } from 'react';
import { avatarColor } from '../data';

// card is a plain style object rather than a wrapper component so it can be spread with custom
// overrides using the JS spread operator: { ...card, marginBottom: 14, background: '#fff1f2' }.
// A component wrapper would require extra props for every override, which gets verbose quickly.
export const card = {
  background: 'var(--c-card)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: 'var(--c-card-sh)',
  border: '1px solid var(--c-card-bd)',
  padding: 18,
};

// Avatar derives its colour from the initials string using avatarColor(), so the same person
// always gets the same colour across every part of the UI: consistent identity cues.
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

export function TabBar({ active, onChange, tabs }) {
  return (
    <div style={{
      display: 'flex', gap: 3,
      background: 'var(--c-tab-track)',
      borderRadius: 14, padding: 4, marginBottom: 24, width: 'fit-content',
    }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            padding: '9px 26px', borderRadius: 11, border: 'none',
            background: active === t.key ? 'var(--c-tab-active)' : 'transparent',
            color: active === t.key ? 'var(--c-text-1)' : 'var(--c-text-3)',
            fontFamily: 'inherit',
            fontWeight: active === t.key ? 700 : 500,
            fontSize: 13, cursor: 'pointer',
            boxShadow: active === t.key ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          {t.label}
          {t.badge > 0 && (
            <span style={{
              background: '#dc2626', color: 'white', fontSize: 9, fontWeight: 800,
              padding: '1px 5px', borderRadius: 20, lineHeight: 1.5,
            }}>{t.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// two visual styles: pass bg for the tinted variant (team lead KPIs), omit for the bordered variant (HR KPIs)
export function StatCard({ label, value, sub, color, bg }) {
  if (bg) {
    return (
      <div style={{
        background: bg, borderRadius: 16,
        boxShadow: 'var(--c-card-sh)',
        border: `1px solid ${color}33`,
        padding: '14px 16px',
      }}>
        <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b', marginTop: 7 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>{sub}</div>}
      </div>
    );
  }
  return (
    <div style={{
      background: 'var(--c-card)',
      backdropFilter: 'blur(10px)',
      borderRadius: 16,
      boxShadow: 'var(--c-card-sh)',
      borderTop: '1px solid var(--c-card-bd)',
      borderRight: '1px solid var(--c-card-bd)',
      borderBottom: '1px solid var(--c-card-bd)',
      borderLeft: `3px solid ${color}`,
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function PageHeader({ name }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
        {new Date().toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
        {greeting}, {name}
      </h1>
      <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>Updated {time}</span>
    </div>
  );
}

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

export function EmptyState({ title, message, color = '#059669', bg = '#f0fdf4', border = '#bbf7d0' }) {
  return (
    <div style={{
      padding: '20px 16px', borderRadius: 12,
      background: bg, border: `1px solid ${border}`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color }}>{title}</div>
      {message && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{message}</div>}
    </div>
  );
}

// DashboardSection is a collapsible card wrapper. The chevron rotates with a CSS transform
// rather than swapping between two icons, which avoids a layout shift on toggle and is one
// less thing to keep in sync with state. defaultOpen lets callers decide whether a section
// should start expanded (e.g. Absences when someone is actually absent) or collapsed.
export function DashboardSection({ title, subtitle, action, collapsible = false, defaultOpen = true, children, style }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...card, ...style }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: open ? 14 : 0,
      }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: subtitle ? 3 : 0 }}>
            {title}
          </h3>
          {subtitle && <p style={{ fontSize: 11, color: '#9ca3af' }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {action}
          {collapsible && (
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#9ca3af', padding: 4,
                display: 'flex', alignItems: 'center',
                borderRadius: 6, transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {open && children}
    </div>
  );
}

export function LastUpdated() {
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>
      Updated {time}
    </span>
  );
}
