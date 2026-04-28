import { SITE_STATUS_COLORS } from '../data';

const STATUS_LABELS = {
  open:    'Open',
  partial: 'Partial',
  reduced: 'Reduced',
  closed:  'Closed',
};

const STATUS_CYCLE = ['open', 'partial', 'reduced', 'closed'];

export default function SiteStatusStrip({ sites = [], onViewMap, onStatusChange }) {
  const interactive = !!onStatusChange;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.7)',
      border: '1px solid #e5e7eb',
      borderRadius: 10, padding: '8px 14px',
      marginBottom: 16,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, color: '#6b7280',
        textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4,
      }}>
        Sites
      </span>
      {interactive && (
        <span style={{ fontSize: 10, color: '#9ca3af', marginRight: 6 }}>
          Click to change status
        </span>
      )}
      {sites.map(site => {
        const color = SITE_STATUS_COLORS[site.status] || '#6b7280';
        return (
          <div
            key={site.name}
            onClick={() => {
              if (!interactive) return;
              const idx = STATUS_CYCLE.indexOf(site.status);
              const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
              onStatusChange(site.name, next);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: `${color}14`,
              border: `1px solid ${color}40`,
              borderRadius: 20, padding: '3px 10px 3px 7px',
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 0.15s',
              userSelect: 'none',
            }}
            title={interactive ? `Click to change ${site.name} status` : undefined}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{site.name}</span>
            <span style={{ fontSize: 11, color, fontWeight: 500 }}>{STATUS_LABELS[site.status] || site.status}</span>
            {interactive && (
              <span style={{ fontSize: 9, color: '#9ca3af', marginLeft: 2 }}>↻</span>
            )}
          </div>
        );
      })}
      {onViewMap && (
        <button
          onClick={onViewMap}
          style={{
            marginLeft: 'auto', fontSize: 11, color: '#7c3aed', fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}
        >
          View map
        </button>
      )}
    </div>
  );
}
