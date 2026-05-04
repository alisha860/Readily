import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import WorldMap from './WorldMap';
import TeamLocator from './TeamLocator';
import { useAccessibility } from '../AccessibilityContext';
import { card, Avatar, TabBar, StatCard, PageHeader, EmptyState } from './shared';
import { TEAM_LEAD_DATA } from '../data';

// Modal that lets the team lead formally escalate an absence situation to HR,
// with optional notes to provide context before submitting.
function EscalateModal({ onClose, showToast, onConfirm, memberName }) {
  const [notes, setNotes] = useState('');
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 20, padding: 32,
        maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.25s ease',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Escalate to HR</h2>
        <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
          {memberName
            ? `This will notify HR about ${memberName}'s absence situation.`
            : 'This will notify the HR team of a critical staffing situation.'}
        </p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add notes for HR (optional)..."
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 13,
            resize: 'none', height: 80, marginBottom: 16, outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e5e7eb',
            background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
          }}>Cancel</button>
          <button type="button" onClick={() => { onConfirm?.(notes); showToast('Escalation sent to HR.', 'success'); onClose(); }} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
          }}>Confirm Escalation</button>
        </div>
      </div>
    </div>
  );
}

export default function TeamLeadDashboard({ user, showToast, employeeAbsent, employeeWFH, addNotification, createEscalation }) {
  const { palette } = useAccessibility();

  // Dot and label colours use the active palette so they adapt in colourblind mode.
  const STATUS_CONFIG = {
    available: { dot: palette.stableLight,   label: 'In',  labelColor: palette.stable   },
    absent:    { dot: palette.criticalLight, label: 'Out', labelColor: palette.critical  },
    wfh:       { dot: '#6366f1',             label: 'WFH', labelColor: '#4f46e5'         },
  };

  const [activeTab, setActiveTab] = useState('team');
  const [showModal, setShowModal] = useState(false);
  const [escalateTarget, setEscalateTarget] = useState(null);
  const [escalation, setEscalation] = useState(null);
  const { team: baseTeam, comparisonData, sites, wfhVsAbsentTrend, siteAvailability } = TEAM_LEAD_DATA;

  // Live-patches the employee's entry so the team lead immediately sees any
  // status change submitted by the employee without needing a page refresh.
  const team = baseTeam.map(m => {
    if (m.isEmployee) {
      const liveScheduleStatus = employeeAbsent ? 'absent' : employeeWFH ? 'wfh' : 'office';
      return {
        ...m,
        status: employeeWFH ? 'wfh' : employeeAbsent ? 'absent' : 'available',
        reason: employeeAbsent ? 'Suspected Illness' : m.reason,
        absenceCategory: employeeAbsent ? 'health' : m.absenceCategory,
        healthStatus: employeeAbsent ? 'symptomatic' : employeeWFH ? 'healthy' : m.healthStatus,
        expectedReturn: employeeAbsent ? 'TBC' : m.expectedReturn,
        desk: employeeWFH || employeeAbsent ? null : m.desk,
        schedule: { ...m.schedule, Tue: liveScheduleStatus },
      };
    }
    return m;
  });

  const absentCount  = team.filter(m => m.status === 'absent').length;
  const wfhCount     = team.filter(m => m.status === 'wfh').length;
  const presentCount = team.filter(m => m.status === 'available').length;
  const absentPct    = Math.round(absentCount / team.length * 100);
  const wfhPct       = Math.round(wfhCount    / team.length * 100);
  const inPct        = 100 - absentPct - wfhPct;
  // Absence thresholds that drive the colour-coded meter in the Analytics tab,
  // visually showing the team lead how close the team is to a critical level.
  const threshold = { green: 15, amber: 25, max: 40 };
  const greenEnd  = (threshold.green / threshold.max) * 100;
  const amberEnd  = (threshold.amber / threshold.max) * 100;
  const markerPos = Math.min((absentPct / threshold.max) * 100, 99);

  const readiness = absentPct > 25 ? 'RED' : absentPct > 15 ? 'AMBER' : 'GREEN';

  const pieData = [
    { name: 'Absent', value: absentPct, color: '#db2777' },
    { name: 'WFH',    value: wfhPct,    color: '#6366f1' },
    { name: 'In',     value: inPct,     color: '#e9d5ff' },
  ].filter(d => d.value > 0);

  const comparisonColors = ['#7c3aed', '#a5b4fc', '#c4b5fd'];
  const unavailableMembers = team.filter(m => m.status === 'absent');
  // Tracks essential and critical roles separately so the team lead can see at
  // a glance whether any high-priority positions are currently uncovered.
  const criticalMembers = team.filter(m => m.criticality === 'essential' || m.criticality === 'critical');
  const criticalUnavailable = criticalMembers.filter(m => m.status === 'absent');
  const availableCritical = criticalMembers.length - criticalUnavailable.length;
  const openIssues = unavailableMembers.length + criticalUnavailable.length;

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <PageHeader name={user.name} subtitle="Team Lead Dashboard" />

      {/* Escalation banner — always visible */}
      {escalation && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff1f2', border: '1.5px solid #fecdd3',
          borderRadius: 12, padding: '12px 16px', marginBottom: 18,
        }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Escalation Active</span>
            <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>HR notified — response expected within 15 minutes.</span>
            {escalation.notes && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Notes: {escalation.notes}</div>}
          </div>
          <button onClick={() => setEscalation(null)} style={{
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
            border: '1px solid #fecdd3', background: 'white', color: '#dc2626',
            cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}>Dismiss</button>
        </div>
      )}

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'team',      label: 'My Team' },
          { key: 'analytics', label: 'Analytics' },
        ]}
      />

      {activeTab === 'team' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
            <StatCard
              label="Team Members"
              value={team.length}
              sub={`${team.filter(m => m.location === 'London').length} London / ${team.filter(m => m.location === 'New York').length} NY / ${team.filter(m => m.location === 'Dubai').length} Dubai`}
              color="#7c3aed" bg="#f5f3ff"
            />
            <StatCard
              label="Available Today"
              value={presentCount + wfhCount}
              sub={`${presentCount} office, ${wfhCount} WFH`}
              color="#059669" bg="#ecfdf5"
            />
            <StatCard
              label="Absent Today"
              value={absentCount}
              sub={absentCount ? 'Listed below' : 'No reported absences'}
              color="#dc2626" bg="#fff1f2"
            />
            <StatCard
              label="Critical Covered"
              value={`${availableCritical}/${criticalMembers.length}`}
              sub={criticalUnavailable.length ? `${criticalUnavailable.length} critical unavailable` : 'All critical roles covered'}
              color={criticalUnavailable.length ? '#d97706' : '#059669'}
              bg={criticalUnavailable.length ? '#fffbeb' : '#ecfdf5'}
            />
          </div>

          {openIssues > 0 && (
            <div style={{
              ...card,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#fffbeb',
              border: '1.5px solid #fde68a',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>Attention needed</div>
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
              >
                {escalation ? 'Escalation Active' : 'Escalate to HR'}
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 14, alignItems: 'start', marginBottom: 14 }}>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 3 }}>Absences</h3>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>People currently marked as absent</p>
                </div>
                <span style={{ fontSize: 22, fontWeight: 900, color: absentCount ? palette.critical : palette.stable, lineHeight: 1 }}>{absentCount}</span>
              </div>

              {unavailableMembers.length === 0 ? (
                <EmptyState title="No absences today" message="The team is fully covered." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {unavailableMembers.map(member => (
                    <div key={member.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 12,
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
              )}
            </div>

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
                        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{member.role} - {member.location}</div>
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

          <TeamLocator team={team} />
        </div>
      )}

      {/* ── TAB: ANALYTICS ────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, alignItems: 'start', marginBottom: 14 }}>

            {/* Absence donut */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4, textAlign: 'center' }}>Team Absence Today</h3>
              <div style={{ position: 'relative' }}>
                <ResponsiveContainer width="100%" height={155}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={65}
                      dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} formatter={v => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#db2777', lineHeight: 1 }}>{absentPct}%</div>
                  <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>Absent</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 8 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                    <span style={{ fontSize: 10, color: '#6b7280' }}>{d.name} {d.value}%</span>
                  </div>
                ))}
              </div>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', marginTop: 6 }}>
                {absentCount} of {team.length} team members absent
              </p>
            </div>

            {/* Threshold meter */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 16, textAlign: 'center' }}>Absence Threshold</h3>
              <div style={{ padding: '0 8px' }}>
                <div style={{ display: 'flex', marginBottom: 5, fontSize: 10, fontWeight: 700, color: '#6b7280' }}>
                  <span style={{ flex: greenEnd, textAlign: 'center' }}>Green</span>
                  <span style={{ flex: amberEnd - greenEnd, textAlign: 'center' }}>Amber</span>
                  <span style={{ flex: 100 - amberEnd, textAlign: 'center' }}>Red</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8, fontSize: 9, color: '#9ca3af' }}>
                  <span style={{ flex: greenEnd, textAlign: 'center' }}>0–15%</span>
                  <span style={{ flex: amberEnd - greenEnd, textAlign: 'center' }}>16–25%</span>
                  <span style={{ flex: 100 - amberEnd, textAlign: 'center' }}>26%+</span>
                </div>
                <div style={{ position: 'relative', height: 14, borderRadius: 7, display: 'flex', overflow: 'hidden' }}>
                  <div style={{ flex: greenEnd, background: '#10b981' }} />
                  <div style={{ flex: amberEnd - greenEnd, background: '#f59e0b' }} />
                  <div style={{ flex: 100 - amberEnd, background: '#ef4444' }} />
                </div>
                <div style={{ position: 'relative', height: 12, marginTop: -7 }}>
                  <div style={{
                    position: 'absolute', left: `${markerPos}%`, transform: 'translateX(-50%)',
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#7c3aed', border: '3px solid white',
                    boxShadow: '0 2px 6px rgba(124,58,237,0.5)',
                  }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: readiness === 'RED' ? palette.critical : readiness === 'AMBER' ? palette.warningLight : palette.stable }}>
                    {absentPct}%
                  </span>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                    Current rate — <strong style={{ color: readiness === 'RED' ? palette.critical : readiness === 'AMBER' ? palette.warningLight : palette.stable }}>
                      {readiness === 'RED' ? 'Red' : readiness === 'AMBER' ? 'Amber' : 'Green'}
                    </strong>
                  </div>
                </div>
                <button onClick={() => showToast('Threshold report submitted to HR for review.', 'info')} style={{
                  width: '100%', marginTop: 14, padding: '9px', borderRadius: 10,
                  border: '1.5px solid #7c3aed', background: 'white',
                  color: '#7c3aed', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}>Report to HR</button>
              </div>
            </div>

            {/* Comparison */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textAlign: 'center' }}>
                Team Absence Comparison
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={comparisonData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                  <XAxis dataKey="team" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={v => [`${v}%`, 'Absence']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="value" name="Absence" radius={[6,6,0,0]}>
                    {comparisonData.map((_, i) => <Cell key={i} fill={comparisonColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
                {comparisonData.map((d, i) => (
                  <div key={d.team} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: comparisonColors[i] }}>{d.value}%</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>{d.team}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WFH vs Absent trend + World map */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14, alignItems: 'start' }}>
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>WFH vs Absent Trend</h3>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>Weekly counts for WFH and absence</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={wfhVsAbsentTrend} barCategoryGap="30%" barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="wfh"    name="WFH"    fill="#6366f1" radius={[4,4,0,0]} />
                  <Bar dataKey="absent" name="Absent" fill="#f472b6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <WorldMap sites={sites} title="Team Availability by Site" siteStats={siteAvailability} />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <EscalateModal
          onClose={() => { setShowModal(false); setEscalateTarget(null); }}
          showToast={showToast}
          memberName={escalateTarget?.name ?? null}
          onConfirm={notes => {
            const created = createEscalation?.({
              targetName: escalateTarget?.name ?? null,
              notes,
              absencePct,
            });
            setEscalation({
              id: created?.id,
              targetName: escalateTarget?.name ?? null,
              notes,
              time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            });
          }}
        />
      )}
    </div>
  );
}
