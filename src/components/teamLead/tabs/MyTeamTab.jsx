// MyTeamTab: today's focus, KPIs, absences, critical roles, and weekly schedule for Team Lead
import TeamLocator from '../TeamLocator';
import { card, Avatar, StatCard, EmptyState, DashboardSection } from '../../shared';

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
  const absentPct = team.length > 0 ? Math.round(absentCount / team.length * 100) : 0;

  // Today's Focus uses a priority hierarchy: a missing critical role always takes precedence
  // over a high absence rate, so the team lead sees the most actionable issue first.
  // The absence threshold (>15%) matches the organisation-wide RED threshold in HRDashboard.
  const focusCritical = criticalUnavailable.length > 0;
  const focusAbsence  = !focusCritical && absentPct > 15;

  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>
      {/* Today's Focus */}
      <div style={{
        ...card, marginBottom: 14,
        background: focusCritical ? '#fff1f2' : focusAbsence ? '#fffbeb' : '#f0fdf4',
        border: `1.5px solid ${focusCritical ? '#fecdd3' : focusAbsence ? '#fde68a' : '#bbf7d0'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: focusCritical ? '#991b1b' : focusAbsence ? '#92400e' : '#065f46', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>
              Today's Focus
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: focusCritical ? '#991b1b' : focusAbsence ? '#92400e' : '#065f46' }}>
              {focusCritical
                ? `Arrange cover for ${criticalUnavailable[0].role}`
                : focusAbsence
                ? `Team at ${absentPct}% absence. Review your cover plan.`
                : 'Team fully covered. No action needed.'}
            </div>
            {(focusCritical || focusAbsence) && (
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>
                {focusCritical
                  ? `${criticalUnavailable.length} critical role${criticalUnavailable.length === 1 ? ' is' : 's are'} currently uncovered`
                  : `${absentCount} of ${team.length} members absent today`}
              </div>
            )}
          </div>
          {(focusCritical || focusAbsence) && (
            <button
              disabled={!!escalation}
              onClick={() => { setEscalateTarget(null); setShowModal(true); }}
              style={{
                padding: '9px 16px', borderRadius: 10, border: 'none', flexShrink: 0,
                background: escalation ? '#fee2e2' : focusCritical ? '#dc2626' : '#d97706',
                color: escalation ? '#dc2626' : 'white',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
                cursor: escalation ? 'default' : 'pointer',
              }}
            >{escalation ? 'Escalation Active' : 'Escalate to HR'}</button>
          )}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
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

      {/* Absences + Critical Roles grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 14, marginBottom: 14 }}>

        <DashboardSection
          title="Absences"
          subtitle="People currently marked as absent"
          action={<span style={{ fontSize: 22, fontWeight: 900, color: absentCount ? '#dc2626' : '#059669', lineHeight: 1 }}>{absentCount}</span>}
          collapsible
          defaultOpen={unavailableMembers.length > 0}
        >
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
                        {member.reason || 'Unavailable'}{member.daysAbsent ? ` - ${member.daysAbsent}d out` : ''}{member.expectedReturn ? ` - back ${member.expectedReturn}` : ''}
                      </div>
                      {member.handoverNotes && (
                        <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 3 }}>
                          Handover: {member.handoverNotes}
                        </div>
                      )}
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
        </DashboardSection>

        <DashboardSection
          title="Critical Roles"
          subtitle="Essential roles that must remain covered"
          action={<span style={{ fontSize: 22, fontWeight: 900, color: criticalUnavailable.length ? '#d97706' : '#059669', lineHeight: 1 }}>{availableCritical}/{criticalMembers.length}</span>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {criticalMembers.map(member => {
              const sc = STATUS_CONFIG[member.status] || STATUS_CONFIG.available;
              return (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <Avatar initials={member.initials} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{member.role}, {member.location}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: sc.labelColor }}>{sc.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>
      </div>

      {/* Weekly schedule */}
      <DashboardSection title="Weekly Schedule" collapsible defaultOpen={false}>
        <TeamLocator team={team} />
      </DashboardSection>
    </div>
  );
}
