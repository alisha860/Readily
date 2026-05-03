import { useState } from 'react';
import { TabBar, PageHeader } from './shared';
import { TEAM_LEAD_DATA } from '../data';
import MyTeamTab    from './teamLead/MyTeamTab';
import AnalyticsTab from './teamLead/AnalyticsTab';

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

export default function TeamLeadDashboard({ user, showToast, employeeAbsent, employeeWFH, employeeExpectedReturn, addNotification, createEscalation }) {
  const [activeTab,      setActiveTab]      = useState('team');
  const [showModal,      setShowModal]      = useState(false);
  const [escalateTarget, setEscalateTarget] = useState(null);
  const [escalation,     setEscalation]     = useState(null);

  const { team: baseTeam, comparisonData, sites, wfhVsAbsentTrend, siteAvailability } = TEAM_LEAD_DATA;

  const team = baseTeam.map(m => {
    if (m.isEmployee) {
      const liveScheduleStatus = employeeAbsent ? 'absent' : employeeWFH ? 'wfh' : 'office';
      return {
        ...m,
        status: employeeWFH ? 'wfh' : employeeAbsent ? 'absent' : 'available',
        reason: employeeAbsent ? 'Suspected Illness' : m.reason,
        absenceCategory: employeeAbsent ? 'health' : m.absenceCategory,
        healthStatus: employeeAbsent ? 'symptomatic' : employeeWFH ? 'healthy' : m.healthStatus,
        expectedReturn: employeeAbsent ? (employeeExpectedReturn ?? 'TBC') : m.expectedReturn,
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

  const unavailableMembers  = team.filter(m => m.status === 'absent');
  const criticalMembers     = team.filter(m => m.criticality === 'essential' || m.criticality === 'critical');
  const criticalUnavailable = criticalMembers.filter(m => m.status === 'absent');
  const availableCritical   = criticalMembers.length - criticalUnavailable.length;
  const openIssues          = unavailableMembers.length + criticalUnavailable.length;

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <PageHeader name={user.name} subtitle="Team Lead Dashboard" />

      {/* Escalation active banner */}
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
        <MyTeamTab
          team={team}
          absentCount={absentCount}
          presentCount={presentCount}
          wfhCount={wfhCount}
          criticalMembers={criticalMembers}
          criticalUnavailable={criticalUnavailable}
          availableCritical={availableCritical}
          unavailableMembers={unavailableMembers}
          openIssues={openIssues}
          escalation={escalation}
          setEscalation={setEscalation}
          showModal={showModal}
          setShowModal={setShowModal}
          setEscalateTarget={setEscalateTarget}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab
          pieData={pieData}
          absentPct={absentPct}
          absentCount={absentCount}
          team={team}
          readiness={readiness}
          markerPos={markerPos}
          greenEnd={greenEnd}
          amberEnd={amberEnd}
          comparisonData={comparisonData}
          wfhVsAbsentTrend={wfhVsAbsentTrend}
          sites={sites}
          siteAvailability={siteAvailability}
          showToast={showToast}
        />
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
              absencePct: absentPct,
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
