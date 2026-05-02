import TeamLocator from '../TeamLocator';
import { card, Avatar, StatCard, EmptyState } from '../shared';

const STATUS_CONFIG = {
  available: { dot: '#10b981', label: 'In',  labelColor: '#059669' },
  absent:    { dot: '#ef4444', label: 'Out', labelColor: '#dc2626' },
  wfh:       { dot: '#6366f1', label: 'WFH', labelColor: '#4f46e5' },
};

export default function MyTeamTab({
  team, absentCount, presentCount, wfhCount,
  criticalMembers, criticalUnavailable, availableCritical,
  unavailableMembers, openIssues,
  escalation, setEscalation,
  showModal, setShowModal, setEscalateTarget,
}) {
  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
        <StatCard
          label="Team Members" value={team.length}
          sub={`${team.filter(m => m.location === 'London').length} London / ${team.filter(m => m.location === 'New York').length} NY / ${team.filter(m => m.location === 'Dubai').length} Dubai`}
          color="#7c3aed" bg="#f5f3ff"
        />
        <StatCard label="Available Today" value={presentCount + wfhCount} sub={`${presentCount} office, ${wfhCount} WFH`} color="#059669" bg="#ecfdf5" />
        <StatCard label="Absent Today"    value={absentCount} sub={absentCount ? 'Listed below' : 'No reported absences'} color="#dc2626" bg="#fff1f2" />
        <StatCard
          label="Critical Covered" value={`${availableCritical}/${criticalMembers.length}`}
          sub={criticalUnavailable.length ? `${criticalUnavailable.length} critical unavailable` : 'All critical roles covered'}
          color={criticalUnavailable.length ? '#d97706' : '#059669'}
          bg={criticalUnavailable.length ? '#fffbeb' : '#ecfdf5'}
        />
      </div>

      {/* Attention needed alert */}
      {openIssues > 0 && (
        <div style={{ ...card, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>Attention Needed</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
              {unavailableMembers.length} absence{unavailableMembers.length === 1 ? '' : 's'} logged today
              {criticalUnavailable.length ? `, including ${criticalUnavailable.length} critical role${criticalUnavailable.length === 1 ? '' : 's'}` : ''}.
            </div>
          </div>
          <button
            disabled={!!escalation}
            onClick={() => { setEscalateTarget(null); setShowModal(true); }}
            style={{
              padding: '9px 14px', borderRadius: 10, border: 'none',
              background: escalation ? '#fee2e2' : '#d97706',
              color: escalation ? '#dc2626' : 'white',
              fontFamily: 'inherit', fontWeight: 800, fontSize: 12,
              cursor: escalation ? 'default' : 'pointer', flexShrink: 0,
            }}
          >{escalation ? 'Escalation Active' : 'Escalate to HR'}</button>
        </div>
      )}

      {/* Absences + Critical Roles grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 14, alignItems: 'start', marginBottom: 14 }}>
        {/* Absences card */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 3 }}>Absences</h3>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>People currently marked as absent</p>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: absentCount ? '#dc2626' : '#059669', lineHeight: 1 }}>{absentCount}</span>
          </div>
          {unavailableMembers.length === 0
            ? <EmptyState title="No absences today" message="The team is fully covered." />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {unavailableMembers.map(member => (
                  <div key={member.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12,
                    background: member.criticality === 'standard' ? '#fff7ed' : '#fff1f2',
                    border: `1px solid ${member.criticality === 'standard' ? '#fed7aa' : '#fecdd3'}`,
                  }}>
                    <Avatar initials={member.initials} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b' }}>{member.name}</span>
                        {member.criticality !== 'standard' && (
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '2px 7px', borderRadius: 999 }}>
                            {member.criticality === 'essential' ? 'Essential' : 'Critical'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>
                        {member.reason || 'Unavailable'}{member.daysAbsent ? ` - ${member.daysAbsent}d out` : ''}{member.expectedReturn ? ` - expected back ${member.expectedReturn}` : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#6b7280' }}>{member.location}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Critical Roles card */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 3 }}>Critical Roles</h3>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>Essential roles that must remain covered</p>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: criticalUnavailable.length ? '#d97706' : '#059669', lineHeight: 1 }}>
              {availableCritical}/{criticalMembers.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {criticalMembers.map(member => {
              const sc = STATUS_CONFIG[member.status] || STATUS_CONFIG.available;
              return (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <Avatar initials={member.initials} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{member.role} — {member.location}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: sc.labelColor }}>{sc.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly schedule */}
      <TeamLocator team={team} />
    </div>
  );
}
