import { useMemo, useState } from 'react';
import { card, Avatar } from './shared';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const STATUS_META = {
  office: { label: 'Office', short: 'Office', color: '#059669', bg: '#ecfdf5', border: '#bbf7d0' },
  wfh: { label: 'WFH', short: 'WFH', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
  leave: { label: 'Leave', short: 'Leave', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  absent: { label: 'Absent', short: 'Out', color: '#dc2626', bg: '#fff1f2', border: '#fecdd3' },
};

const CRITICALITY_META = {
  essential: { label: 'Essential', color: '#dc2626', bg: '#fff1f2' },
  critical: { label: 'Critical', color: '#d97706', bg: '#fffbeb' },
  standard: { label: 'Standard', color: '#059669', bg: '#f0fdf4' },
};

function StatusPill({ label, color, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 9, fontWeight: 800, color, background: bg,
      padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

// Falls back to the member's live status when no scheduled entry exists,
// so newly absent or WFH members display correctly in the weekly grid.
function getScheduleStatus(member, day) {
  if (member.schedule?.[day]) return member.schedule[day];
  if (member.status === 'wfh') return 'wfh';
  if (member.status === 'absent') return 'absent';
  return 'office';
}

export default function TeamLocator({ team = [] }) {
  // Derives the location filter options from the team data so the list always
  // reflects whichever offices are actually represented in the current team.
  const locations = useMemo(() => (
    ['All', ...Array.from(new Set(team.map(member => member.location).filter(Boolean)))]
  ), [team]);
  const [selectedLocation, setSelectedLocation] = useState('All');

  const filteredTeam = selectedLocation === 'All'
    ? team
    : team.filter(member => member.location === selectedLocation);

  const visibleLocations = locations.filter(location => location !== 'All');
  const locationStats = visibleLocations.map(location => {
    const members = team.filter(member => member.location === location);
    const available = members.filter(member => member.status === 'available' || member.status === 'wfh').length;
    return {
      location,
      total: members.length,
      available,
      absent: members.filter(member => member.status === 'absent').length,
      wfh: members.filter(member => member.status === 'wfh').length,
    };
  });

  return (
    <div style={card}>
      <div style={{ marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 3 }}>
            Weekly Location Schedule
          </h3>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>
            Filter by location to see each person's office, WFH, leave, or absence plan
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {locations.map(location => (
          <button
            key={location}
            onClick={() => setSelectedLocation(location)}
            style={{
              padding: '6px 11px',
              borderRadius: 999,
              border: selectedLocation === location ? 'none' : '1px solid #e5e7eb',
              background: selectedLocation === location ? '#7c3aed' : 'white',
              color: selectedLocation === location ? 'white' : '#6b7280',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {location}
          </button>
        ))}
      </div>

      {selectedLocation === 'All' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {locationStats.map(location => (
            <button
              key={location.location}
              onClick={() => setSelectedLocation(location.location)}
              style={{
                textAlign: 'left', padding: '10px 11px', borderRadius: 10,
                border: '1px solid #e5e7eb', background: '#f9fafb',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b' }}>{location.location}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>
                {location.available}/{location.total} available
              </div>
            </button>
          ))}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 620 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '170px repeat(5, 1fr)',
            gap: 6,
            marginBottom: 6,
          }}>
            <div />
            {DAYS.map(day => (
              <div key={day} style={{ fontSize: 10, fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', textAlign: 'center' }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredTeam.map(member => {
              const criticality = CRITICALITY_META[member.criticality] || CRITICALITY_META.standard;
              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '170px repeat(5, 1fr)',
                    gap: 6,
                    alignItems: 'stretch',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <Avatar initials={member.initials} size={28} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.name}
                      </div>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                        <span style={{ fontSize: 9, color: '#9ca3af' }}>{member.location}</span>
                        {member.criticality !== 'standard' && <StatusPill {...criticality} />}
                      </div>
                    </div>
                  </div>

                  {DAYS.map(day => {
                    const statusKey = getScheduleStatus(member, day);
                    const status = STATUS_META[statusKey] || STATUS_META.office;
                    const isOffice = statusKey === 'office';
                    return (
                      <div
                        key={`${member.id}-${day}`}
                        title={`${member.name}: ${status.label}${isOffice && member.desk ? ` (${member.desk})` : ''}`}
                        style={{
                          minHeight: 42,
                          borderRadius: 9,
                          border: `1px solid ${status.border}`,
                          background: status.bg,
                          color: status.color,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '5px 4px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 900, lineHeight: 1.1 }}>{status.short}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
