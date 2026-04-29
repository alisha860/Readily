import { useState } from 'react';
import { avatarColor } from '../data';

// Shared surface style applied to every panel, giving the dashboard a
// consistent frosted-glass appearance across all three user roles.
export const card = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
  border: '1px solid rgba(255,255,255,0.9)',
  padding: 18,
};

// Circular avatar using initials to visually identify each team member.
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

// Navigation strip for switching dashboard sections. A red badge on a tab
// alerts the user that items in that section need attention.
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
              background: '#dc2626', color: 'white', fontSize: 9, fontWeight: 800,
              padding: '1px 5px', borderRadius: 20, lineHeight: 1.5,
            }}>{t.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// Displays a single KPI figure. Two visual variants: a tinted card (Team Lead)
// and an accent-border card (HR), so each role's metrics feel distinct.
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

// Greets the current user by name and shows today's date, orienting them on
// which dashboard they are viewing.
export function PageHeader({ name, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
        {new Date().toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
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

// RAG label badge — always shows text, not colour alone (accessibility)
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

// A card wrapper with a consistent header row and optional collapsible toggle.
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
                color: '#9ca3af', padding: 4, display: 'flex', alignItems: 'center',
                borderRadius: 6, transition: 'background 0.12s',
              }}
              title={open ? 'Collapse' : 'Expand'}
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
