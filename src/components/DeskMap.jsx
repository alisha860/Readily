import { useState, useRef } from 'react';

// Visual styling per desk state so employees can read floor occupancy at a
// glance and identify available desks to book for the following day.
const DESK_CONFIG = {
  available: { bg: '#f0fdf4', border: '#86efac', textColor: '#15803d', label: 'Available' },
  occupied:  { bg: '#f9fafb', border: '#d1d5db', textColor: '#6b7280', label: 'Occupied'  },
  mine:      { bg: '#7c3aed', border: '#5b21b6', textColor: 'white',   label: 'Your desk' },
  wfh:       { bg: '#eff6ff', border: '#93c5fd', textColor: '#1d4ed8', label: 'WFH today' },
  booked:    { bg: '#fef3c7', border: '#fcd34d', textColor: '#92400e', label: 'Your booking' },
};

export default function DeskMap({ booking, isWFH = false, showToast }) {
  const [hoveredDesk, setHoveredDesk] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bookedDeskId, setBookedDeskId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef(null);

  if (!booking) return null;
  const { site, floor, section, myDeskId, rows } = booking;

  const allDesks = rows.filter(r => !r.type).flatMap(r => r.desks);
  const available  = allDesks.filter(d => d.status === 'available').length;
  const occupied   = allDesks.filter(d => d.status === 'occupied' || d.status === 'mine').length;
  const remote     = allDesks.filter(d => d.status === 'wfh').length;
  const utilPct    = Math.round((occupied / allDesks.length) * 100);

  const handleMouseMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Only available desks are clickable; clicking the already-selected desk
  // deselects it, allowing the employee to change their choice before confirming.
  const handleDeskClick = desk => {
    if (desk.status !== 'available' && desk.id !== bookedDeskId) return;
    if (confirmed) return;
    if (desk.id === bookedDeskId) { setBookedDeskId(null); return; }
    setBookedDeskId(desk.id);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    showToast?.(`Desk ${bookedDeskId} booked for tomorrow.`, 'success');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }} onMouseMove={handleMouseMove}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>
            Desk Overview — {floor}
          </h3>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>
            {site} · {section} · Your desk: <strong style={{ color: '#7c3aed' }}>{myDeskId}</strong>
            {isWFH && <span style={{ marginLeft: 6, color: '#1d4ed8' }}>(WFH today)</span>}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>{utilPct}%</div>
          <div style={{ fontSize: 10, color: '#9ca3af' }}>floor used</div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Available', value: available, color: '#059669', bg: '#d1fae5' },
          { label: 'Occupied',  value: occupied,  color: '#374151', bg: '#f3f4f6' },
          { label: 'WFH',       value: remote,    color: '#1d4ed8', bg: '#dbeafe' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, textAlign: 'center', padding: '6px 0',
            background: s.bg, borderRadius: 8,
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Booking prompt / confirmation */}
      {!isWFH && (
        <div style={{ marginBottom: 14 }}>
          {confirmed ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f0fdf4', border: '1.5px solid #86efac',
              borderRadius: 10, padding: '8px 14px',
            }}>
              <span style={{ fontSize: 14 }}>✅</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>
                Desk {bookedDeskId} booked for tomorrow
              </span>
              <button onClick={() => { setConfirmed(false); setBookedDeskId(null); }} style={{
                marginLeft: 'auto', fontSize: 10, color: '#9ca3af',
                background: 'none', border: 'none', cursor: 'pointer',
              }}>Cancel</button>
            </div>
          ) : bookedDeskId ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fffbeb', border: '1.5px solid #fcd34d',
              borderRadius: 10, padding: '8px 14px',
            }}>
              <span style={{ fontSize: 12, color: '#92400e' }}>
                Book desk <strong>{bookedDeskId}</strong> for tomorrow?
              </span>
              <button onClick={handleConfirm} style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '5px 14px',
                borderRadius: 8, border: 'none', background: '#d97706',
                color: 'white', cursor: 'pointer', fontFamily: 'inherit',
              }}>Confirm</button>
              <button onClick={() => setBookedDeskId(null)} style={{
                fontSize: 11, fontWeight: 600, padding: '5px 10px',
                borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white',
                color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: '#9ca3af' }}>
              Click an <span style={{ color: '#059669', fontWeight: 600 }}>available</span> desk to book it for tomorrow
            </p>
          )}
        </div>
      )}

      {/* Desk grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {rows.map(row => {
          if (row.type === 'aisle') return (
            <div key="aisle" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb', width: 18, textAlign: 'center' }} />
              <div style={{ flex: 1, borderTop: '1.5px dashed #e5e7eb' }} />
              <span style={{ fontSize: 9, color: '#d1d5db', fontWeight: 600, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>AISLE</span>
              <div style={{ flex: 1, borderTop: '1.5px dashed #e5e7eb' }} />
            </div>
          );

          return (
            <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Row label */}
              <span style={{ fontSize: 10, fontWeight: 700, color: '#d1d5db', width: 18, textAlign: 'center', flexShrink: 0 }}>
                {row.id}
              </span>
              {/* Desks — wider gap every 2 to group into pairs */}
              {row.desks.map((desk, i) => {
                const isMyDesk   = desk.id === myDeskId;
                const isBooked   = desk.id === bookedDeskId && !confirmed;
                const isAvailable = desk.status === 'available' && !confirmed;

                // Override display status for WFH and pending bookings without
                // mutating the underlying data.
                let effectiveStatus = desk.status;
                if (isMyDesk && isWFH) effectiveStatus = 'wfh';
                if (isBooked) effectiveStatus = 'booked';

                const dc = DESK_CONFIG[effectiveStatus] || DESK_CONFIG.occupied;
                const clickable = isAvailable || isBooked;

                return (
                  <div
                    key={desk.id}
                    style={{ marginLeft: i > 0 && i % 2 === 0 ? 8 : 0 }}
                  >
                    <div
                      onMouseEnter={() => setHoveredDesk(desk)}
                      onMouseLeave={() => setHoveredDesk(null)}
                      onClick={() => handleDeskClick(desk)}
                      style={{
                        width: 44, height: 30,
                        borderRadius: 6,
                        background: dc.bg,
                        border: `1.5px solid ${dc.border}`,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: clickable ? 'pointer' : 'default',
                        boxShadow: isMyDesk ? '0 0 0 3px rgba(124,58,237,0.2)' : isBooked ? '0 0 0 2px rgba(217,119,6,0.3)' : 'none',
                        transition: 'all 0.15s',
                        userSelect: 'none',
                      }}
                      title={clickable ? `Click to book desk ${desk.id}` : undefined}
                    >
                      <span style={{ fontSize: 9, fontWeight: isMyDesk ? 800 : 600, color: dc.textColor, lineHeight: 1 }}>
                        {desk.id}
                      </span>
                      {isMyDesk && (
                        <span style={{ fontSize: 7, color: dc.textColor, lineHeight: 1, marginTop: 1, opacity: 0.85 }}>YOU</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
        {Object.entries(DESK_CONFIG).map(([key, dc]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 3,
              background: dc.bg, border: `1.5px solid ${dc.border}`,
            }} />
            <span style={{ fontSize: 10, color: '#6b7280' }}>{dc.label}</span>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hoveredDesk && (
        <div style={{
          position: 'absolute',
          top: mousePos.y + 10,
          left: mousePos.x + 12,
          background: 'white', borderRadius: 10,
          padding: '8px 12px',
          boxShadow: '0 4px 18px rgba(30,27,75,0.13)',
          border: '1px solid #e5e7eb',
          zIndex: 50, pointerEvents: 'none', minWidth: 110,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>Desk {hoveredDesk.id}</div>
          {hoveredDesk.name && (
            <div style={{ fontSize: 11, color: '#374151', marginTop: 2 }}>{hoveredDesk.name}</div>
          )}
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
            {DESK_CONFIG[hoveredDesk.id === myDeskId && isWFH ? 'wfh' : hoveredDesk.status]?.label || 'Unknown'}
          </div>
        </div>
      )}
    </div>
  );
}
