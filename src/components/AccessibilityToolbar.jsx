import { useState } from 'react';
import { useAccessibility } from '../AccessibilityContext';

// Floating toolbar that lets users adjust text size, contrast, and colour
// palette without leaving the current dashboard view.
export default function AccessibilityToolbar() {
  const {
    colourblind, toggleColourblind,
    highContrast, toggleHighContrast,
    fontSizeIndex, setFontSize, FONT_LABELS,
    resetAll, hasChanges,
  } = useAccessibility();

  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 9999 }}>
      {/* Floating trigger — always visible so settings are discoverable */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Accessibility settings"
        title="Accessibility settings"
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: open ? '#7c3aed' : '#1e1b4b',
          color: 'white', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
          <path d="M7 8h10" />
          <path d="M12 8v4" />
          <path d="M9 20l3-8 3 8" />
          <path d="M9.5 16h5" />
        </svg>
        {/* Amber dot shown when any setting is active, so users know the
            toolbar is in a non-default state even when it is closed. */}
        {hasChanges && !open && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 10, height: 10, borderRadius: '50%',
            background: '#f59e0b', border: '2px solid white',
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: 60, left: 0,
          width: 290, background: 'white', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(30,27,75,0.18), 0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(124,58,237,0.12)',
          padding: 20,
          animation: 'slideUp 0.15s ease',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
              Accessibility
            </h3>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#9ca3af', fontSize: 18, padding: 0, lineHeight: 1,
              }}
              aria-label="Close accessibility panel"
            >
              ×
            </button>
          </div>

          {/* Text Size — three preset scales applied via root font-size and CSS zoom */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 11, fontWeight: 700, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              display: 'block', marginBottom: 8,
            }}>
              Text Size
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {FONT_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setFontSize(i)}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10,
                    border: fontSizeIndex === i ? '2px solid #7c3aed' : '1.5px solid #e5e7eb',
                    background: fontSizeIndex === i ? '#f5f3ff' : 'white',
                    color: fontSizeIndex === i ? '#7c3aed' : '#374151',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="High Contrast"
            description="Stronger text and borders"
            active={highContrast}
            onToggle={toggleHighContrast}
          />

          <ToggleRow
            label="Colourblind-Friendly"
            description="Blue/amber palette, distinct shapes"
            active={colourblind}
            onToggle={toggleColourblind}
          />

          {/* Preview chips shown when colourblind mode is active so users can
              see the new palette before closing the panel. */}
          {colourblind && (
            <div style={{
              display: 'flex', gap: 8, justifyContent: 'center',
              marginBottom: 16, padding: '8px 0',
            }}>
              <PaletteChip label="Stable"   bg="#dbeafe" text="#1e40af" shape="circle"   />
              <PaletteChip label="Warning"  bg="#fef3c7" text="#92400e" shape="triangle" />
              <PaletteChip label="Critical" bg="#ffe4e6" text="#881337" shape="square"   />
            </div>
          )}

          {/* Reset only appears when at least one setting has been changed */}
          {hasChanges && (
            <button
              onClick={resetAll}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 9,
                border: '1px solid #e9d5ff', background: '#f8f7ff',
                color: '#7c3aed', fontFamily: 'inherit', fontSize: 11,
                fontWeight: 800, cursor: 'pointer',
              }}
            >
              Reset to defaults
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Reusable toggle row used for both High Contrast and Colourblind mode,
// with ARIA role="switch" so screen readers announce the on/off state.
function ToggleRow({ label, description, active, onToggle }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 12, padding: '10px 12px', borderRadius: 10,
      background: active ? '#f5f3ff' : '#f9fafb',
      border: active ? '1.5px solid #7c3aed' : '1.5px solid transparent',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{label}</div>
        <div style={{ fontSize: 10, color: '#9ca3af' }}>{description}</div>
      </div>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={active}
        aria-label={`Toggle ${label}`}
        style={{
          width: 44, height: 24, borderRadius: 12, flexShrink: 0,
          background: active ? '#7c3aed' : '#d1d5db',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 2,
          left: active ? 22 : 2,
          width: 20, height: 20, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}

// Small shape chip used in the palette preview. Different shapes (circle,
// triangle, square) provide a non-colour cue per WCAG 1.4.1.
function PaletteChip({ label, bg, text, shape }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 28, height: 28, background: bg,
        border: `2px solid ${text}`,
        borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? 4 : 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...(shape === 'triangle' ? {
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          borderRadius: 0,
        } : {}),
      }} />
      <span style={{ fontSize: 9, fontWeight: 700, color: text }}>{label}</span>
    </div>
  );
}
