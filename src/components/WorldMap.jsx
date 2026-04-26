import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { SITE_STATUS_COLORS } from '../data';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const STATUS_LABELS = {
  partial: 'Partial Closure',
  reduced: 'Reduced Capacity',
  open: 'Open',
  closed: 'Closed',
};

export default function WorldMap({ sites = [], title = 'Site Locations' }) {
  return (
    <div>
      {title && (
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 8 }}>
          {title}
        </h3>
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
                    hover: { fill: '#a5c8f8', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {sites.map(({ name, coords, status }) => (
            <Marker key={name} coordinates={coords}>
              <circle
                r={5}
                fill={SITE_STATUS_COLORS[status] || '#6b7280'}
                stroke="white"
                strokeWidth={1.5}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={8}
                y={4}
                fontSize={7.5}
                fontWeight={600}
                fill="#1e3a5f"
                fontFamily="Inter, sans-serif"
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 9, height: 9, borderRadius: '50%',
              background: SITE_STATUS_COLORS[key],
            }} />
            <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
