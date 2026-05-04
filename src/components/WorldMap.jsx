import { useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useAccessibility } from '../AccessibilityContext';
import { SITE_STATUS_COLORS } from '../data';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const STATUS_LABELS = {
  partial: 'Partially Open',
  reduced: 'Reduced Capacity',
  open: 'Open',
  closed: 'Closed',
};

// Interactive world map showing each office site's operational status. When
// siteStats are provided (Team Lead view), hovering a marker shows team
// availability figures for that location.
export default function WorldMap({ sites = [], title = 'Site Locations', siteStats = {} }) {
  const { palette } = useAccessibility();
  const [hoveredSite, setHoveredSite] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const hasStats = Object.keys(siteStats).length > 0;

  // Track position relative to this container so we can use position:absolute
  // (position:fixed breaks when a parent has backdrop-filter)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }} onMouseMove={handleMouseMove}>
      {title && (
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>
          {title}
        </h3>
      )}
      {hasStats && (
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
          Hover a site marker to see team availability
        </p>
      )}
      <div style={{ borderRadius: 10, overflow: 'hidden', background: '#dbeafe' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [10, 15] }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#bfdbfe"
                  stroke="#93c5fd"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { fill: '#a5c8f8', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {sites.map(({ name, coords, status }) => {
            const stats = siteStats[name] ?? null;
            return (
              <Marker key={name} coordinates={coords}>
                <circle
                  r={stats ? 6 : 5}
                  fill={SITE_STATUS_COLORS[status] || '#6b7280'}
                  stroke="white"
                  strokeWidth={1.5}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredSite({ name, status, stats })}
                  onMouseLeave={() => setHoveredSite(null)}
                />
                <text
                  x={8} y={4}
                  fontSize={7.5} fontWeight={600}
                  fill="#1e3a5f"
                  fontFamily="Inter, sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {name}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: SITE_STATUS_COLORS[key] }} />
            <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip — absolute so it's unaffected by backdrop-filter on parent */}
      {hoveredSite && (
        <div style={{
          position: 'absolute',
          top: mousePos.y + 14,
          left: mousePos.x + 14,
          background: 'white',
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: '0 6px 24px rgba(30,27,75,0.16), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
          zIndex: 50,
          minWidth: 180,
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 5 }}>
            {hoveredSite.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: hoveredSite.stats ? 10 : 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: SITE_STATUS_COLORS[hoveredSite.status] }} />
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              {STATUS_LABELS[hoveredSite.status] || hoveredSite.status}
            </span>
          </div>
          {hoveredSite.stats && (
            <>
              <div style={{ height: 1, background: '#f3f4f6', marginBottom: 10 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Team available</span>
                <span style={{
                  fontSize: 15, fontWeight: 800,
                  color: hoveredSite.stats.pct >= 80 ? palette.stable : hoveredSite.stats.pct >= 65 ? palette.warning : palette.critical,
                }}>
                  {hoveredSite.stats.pct}%
                </span>
              </div>
              <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{
                  width: `${hoveredSite.stats.pct}%`, height: '100%', borderRadius: 3,
                  background: hoveredSite.stats.pct >= 80 ? palette.stableLight : hoveredSite.stats.pct >= 65 ? palette.warningLight : palette.criticalLight,
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                {hoveredSite.stats.available} of {hoveredSite.stats.total} staff available
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
