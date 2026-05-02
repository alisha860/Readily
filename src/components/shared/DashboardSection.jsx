import { useState } from 'react';
import { card } from './Card';

// Card wrapper with consistent header row and optional collapse toggle.
export function DashboardSection({ title, subtitle, action, collapsible = false, defaultOpen = true, children, style }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...card, ...style }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: open ? 14 : 0,
      }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: subtitle ? 3 : 0 }}>{title}</h3>
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
