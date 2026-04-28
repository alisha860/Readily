import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ReferenceLine,
} from 'recharts';
import WorldMap from './WorldMap';
import SiteStatusStrip from './SiteStatusStrip';
import { card, TabBar, StatCard, PageHeader, StatusBadge, EmptyState, LastUpdated } from './shared';
import { HR_DATA } from '../data';

const PIE_COLORS = {
  inOffice: '#6366f1',
  wfh: '#8b5cf6',
  absent: '#f472b6',
  onLeave: '#a5b4fc',
};

const PERIODS = [
  { key: 'week',    label: 'This Week' },
  { key: 'month',   label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
];

const REPORT_TYPES = [
  { key: 'Executive Summary',      desc: 'High-level snapshot of availability, absence rate, readiness score, and critical risks.' },
  { key: 'Full Workforce Report',  desc: 'Complete breakdown across all departments: in-office, WFH, absent, on leave, with trend analysis.' },
  { key: 'Absence Analysis',       desc: 'Absence, WFH, in-office, and leave patterns by department and time period.' },
  { key: 'Department Risk Report', desc: 'Current department risk status based on minimum staffing, absence levels, and site disruption.' },
  { key: 'Minimum Staffing Coverage', desc: 'Coverage of departments that are below or close to minimum staffing thresholds.' },
  { key: 'Site Status Report',     desc: 'Operational status across all global sites with staffing levels per location.' },
];

const REPORT_FORMATS = ['PDF', 'CSV', 'Excel'];

const RISK_ORDER = {
  Critical: 0,
  Warning: 1,
  Monitor: 2,
  Stable: 3,
};

function getCoverageStatus(current, min) {
  if (current < min) return { level: 'Critical', color: '#dc2626', bg: '#fff1f2' };
  if (current <= min + 5) return { level: 'Warning', color: '#d97706', bg: '#fffbeb' };
  return { level: 'Stable', color: '#10b981', bg: '#f0fdf4' };
}

function getDeptAbsenceRate(deptName, snapshot) {
  const dept = snapshot.find(d => d.dept === deptName);
  if (!dept) return 0;
  const total = dept.inOffice + dept.wfh + dept.absent + dept.onLeave;
  return Math.round((dept.absent / total) * 100);
}

function buildRiskSummary(deptCoverage, snapshot, sites) {
  const deptRisks = deptCoverage.flatMap(dept => {
    const coverage = getCoverageStatus(dept.current, dept.min);
    const absenceRate = getDeptAbsenceRate(dept.name, snapshot);
    const risks = [];
    const absenceContext = absenceRate >= 25 ? ` Absence is also high at ${absenceRate}%.` : '';

    if (coverage.level === 'Critical') {
      risks.push({
        id: `coverage-${dept.name}`,
        dept: dept.name,
        level: 'Critical',
        issue: `${dept.name} is ${dept.min - dept.current} below minimum staffing (${dept.current}/${dept.min}).${absenceContext}`,
        source: 'Minimum staffing',
        color: coverage.color,
        bg: coverage.bg,
      });
    } else if (coverage.level === 'Warning') {
      risks.push({
        id: `coverage-${dept.name}`,
        dept: dept.name,
        level: 'Warning',
        issue: `${dept.name} has only ${dept.current - dept.min} people above minimum staffing.${absenceContext}`,
        source: 'Thin cover',
        color: coverage.color,
        bg: coverage.bg,
      });
    } else if (absenceRate >= 25) {
      risks.push({
        id: `absence-${dept.name}`,
        dept: dept.name,
        level: 'Warning',
        issue: `${dept.name} absence is ${absenceRate}%, above the 25% disruption trigger.`,
        source: 'Absence trend',
        color: '#d97706',
        bg: '#fffbeb',
      });
    }

    return risks;
  });

  const siteRisks = sites
    .filter(site => site.status === 'closed' || site.status === 'reduced')
    .map(site => ({
      id: `site-${site.name}`,
      dept: site.name,
      level: site.status === 'closed' ? 'Critical' : 'Warning',
      issue: `${site.name} site status is ${site.status}. Local staffing plans may need adjustment.`,
      source: 'Site operations',
      color: site.status === 'closed' ? '#dc2626' : '#d97706',
      bg: site.status === 'closed' ? '#fff1f2' : '#fffbeb',
    }));

  return [...deptRisks, ...siteRisks].sort((a, b) => (
    (RISK_ORDER[a.level] ?? 99) - (RISK_ORDER[b.level] ?? 99)
  ));
}

function OrgSnapshotTable({ data }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 4 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
            {['Department', 'In Office', 'WFH', 'Absent', 'On Leave', 'Abs. Rate'].map(h => (
              <th key={h} style={{
                padding: '8px 10px', textAlign: h === 'Department' ? 'left' : 'right',
                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            const total = d.inOffice + d.wfh + d.absent + d.onLeave;
            const absRate = Math.round(d.absent / total * 100);
            return (
              <tr key={d.dept} style={{ borderBottom: '1px solid #f9fafb', background: i % 2 === 0 ? 'transparent' : '#fafafa' }}>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: '#1e1b4b' }}>{d.dept}</td>
                <td style={{ padding: '10px 10px', textAlign: 'right', color: '#6366f1', fontWeight: 600 }}>{d.inOffice}</td>
                <td style={{ padding: '10px 10px', textAlign: 'right', color: '#8b5cf6', fontWeight: 600 }}>{d.wfh}</td>
                <td style={{ padding: '10px 10px', textAlign: 'right', color: '#f472b6', fontWeight: 600 }}>{d.absent}</td>
                <td style={{ padding: '10px 10px', textAlign: 'right', color: '#a5b4fc', fontWeight: 600 }}>{d.onLeave}</td>
                <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 12,
                    background: absRate > 25 ? '#fee2e2' : absRate > 15 ? '#fef3c7' : '#d1fae5',
                    color: absRate > 25 ? '#991b1b' : absRate > 15 ? '#92400e' : '#065f46',
                    fontWeight: 700, fontSize: 11,
                  }}>{absRate}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HRDashboard({ user, showToast, employeeAbsent, employeeWFH, pushStaffAnnouncement, addNotification, escalations = [], resolveEscalation }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterDept, setFilterDept]   = useState('All');
  const [filterPeriod, setFilterPeriod] = useState('week');
  const [snapshotView, setSnapshotView] = useState('bar');
  const [reportType,   setReportType]   = useState('Executive Summary');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [reportPeriod, setReportPeriod] = useState('week');
  const [reportScope,  setReportScope]  = useState('All Departments');
  const [reportLoading, setReportLoading] = useState(false);
  const [stackedPeriod, setStackedPeriod] = useState('week');
  const [showGaugeInfo, setShowGaugeInfo] = useState(false);

  // Mutable local state so coverage and site risks update as HR makes changes.
  const [deptCoverage, setDeptCoverage] = useState(HR_DATA.highRiskDepts);
  const [activeSites,  setActiveSites]  = useState(HR_DATA.sites);
  const [deployTarget, setDeployTarget] = useState(null);
  const [deployAmount, setDeployAmount] = useState(5);
  const [alertMsg,     setAlertMsg]     = useState('');
  const [alertType,    setAlertType]    = useState('warning');

  const { staffStatus, orgAbsenceSnapshot, absenceTrendsByPeriod, workforceTrendStacked, returnForecast } = HR_DATA;

  const deptNames         = orgAbsenceSnapshot.map(d => d.dept);
  const filteredSnapshot  = filterDept === 'All' ? orgAbsenceSnapshot : orgAbsenceSnapshot.filter(d => d.dept === filterDept);
  const activeTrend       = absenceTrendsByPeriod[filterPeriod];
  const drillDept         = filterDept !== 'All' ? orgAbsenceSnapshot.find(d => d.dept === filterDept) : null;

  const liveAbsent  = staffStatus.absent + (employeeAbsent ? 1 : 0);
  const liveWFH     = staffStatus.wfh    + (employeeWFH    ? 1 : 0);

  const pieData = [
    { name: 'In Office', value: staffStatus.inOffice, color: PIE_COLORS.inOffice },
    { name: 'WFH',       value: liveWFH,              color: PIE_COLORS.wfh },
    { name: 'Absent',    value: liveAbsent,            color: PIE_COLORS.absent },
    { name: 'On Leave',  value: staffStatus.onLeave,   color: PIE_COLORS.onLeave },
  ];

  const absenceRate      = Math.round(liveAbsent / staffStatus.total * 1000) / 10;
  const riskSummary      = buildRiskSummary(deptCoverage, orgAbsenceSnapshot, activeSites);
  const sortedDeptCoverage = [...deptCoverage].sort((a, b) => (
    (RISK_ORDER[getCoverageStatus(a.current, a.min).level] ?? 99) -
    (RISK_ORDER[getCoverageStatus(b.current, b.min).level] ?? 99)
  ));
  const criticalAlerts   = riskSummary.filter(r => r.level === 'Critical').length;
  const operationalSites = activeSites.filter(s => s.status === 'open' || s.status === 'partial').length;

  const unresolvedCritical = riskSummary.find(r => r.level === 'Critical');
  const unresolvedWarning  = riskSummary.some(r => r.level === 'Warning');
  const readiness = unresolvedCritical || absenceRate > 15 ? 'RED'
    : unresolvedWarning || absenceRate > 10 ? 'AMBER'
    : 'GREEN';
  const warningAlerts = riskSummary.filter(r => r.level === 'Warning').length;
  const openEscalations = escalations.filter(e => e.status === 'open');
  const readinessScore = Math.max(0, Math.min(100,
    100 - criticalAlerts * 20 - warningAlerts * 8 - Math.max(0, (absenceRate - 8) * 2)
  ));

  const kpis = [
    { label: 'Total Workforce',    value: String(staffStatus.total),                      sub: 'employees',          color: '#7c3aed' },
    { label: 'Absence Rate Today', value: `${absenceRate}%`,                              sub: 'vs 8% weekly avg',   color: '#db2777' },
    { label: 'Critical Risks',     value: String(criticalAlerts),                         sub: 'from staffing and sites', color: '#dc2626' },
    { label: 'Sites Operational',  value: `${operationalSites} / ${activeSites.length}`,  sub: 'worldwide',          color: '#059669' },
  ];

  const filterPill = (active, onClick, label) => (
    <button key={label} onClick={onClick} style={{
      padding: '5px 13px', borderRadius: 20,
      border: active ? 'none' : '1.5px solid #e5e7eb',
      background: active ? 'rgba(124,58,237,0.1)' : 'white',
      color: active ? '#7c3aed' : '#6b7280',
      fontSize: 11, fontWeight: active ? 700 : 500,
      cursor: 'pointer', fontFamily: 'inherit',
      outline: active ? '1.5px solid #7c3aed' : 'none',
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  const viewBtn = (view, label) => (
    <button onClick={() => setSnapshotView(view)} style={{
      padding: '4px 11px', borderRadius: 8, border: 'none',
      background: snapshotView === view ? '#7c3aed' : 'transparent',
      color: snapshotView === view ? 'white' : '#6b7280',
      fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    }}>{label}</button>
  );

  const reportPill = (active, onClick, label) => (
    <button key={label} onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 20,
      border: active ? 'none' : '1.5px solid #e5e7eb',
      background: active ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'white',
      color: active ? 'white' : '#6b7280',
      fontSize: 12, fontWeight: active ? 700 : 500,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
    }}>{label}</button>
  );

  const handleGenerate = () => {
    setReportLoading(true);
    setTimeout(() => {
      setReportLoading(false);
      showToast(`"${reportType}" (${reportFormat}) generated — ${reportScope}, ${PERIODS.find(p => p.key === reportPeriod)?.label ?? reportPeriod}.`, 'success');
    }, 1600);
  };

  const selectedReportDesc = REPORT_TYPES.find(r => r.key === reportType)?.desc ?? '';

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <PageHeader name={user.name} subtitle="HR Manager Dashboard" />

      {/* Live absence alert — always visible */}
      {employeeAbsent && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff7ed', border: '1.5px solid #fed7aa',
          borderRadius: 10, padding: '10px 16px', marginBottom: 14,
          fontSize: 12, color: '#92400e',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
          <span><strong>New self-reported absence</strong> — Simone has reported absent. Absence rate updated.</span>
        </div>
      )}

      {/* Readiness banner — always visible */}

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'overview', label: 'Overview', badge: criticalAlerts },
          { key: 'analyse',  label: 'Analyse' },
          { key: 'reports',  label: 'Reports' },
        ]}
      />

      {/* ── TAB: OVERVIEW ─────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          {/* Site status strip — clickable to cycle status */}
          <SiteStatusStrip
            sites={activeSites}
            onViewMap={() => setActiveTab('analyse')}
            onStatusChange={(name, newStatus) => {
              setActiveSites(prev => prev.map(s => s.name === name ? { ...s, status: newStatus } : s));
              showToast(`${name} status updated to ${newStatus}.`, newStatus === 'closed' ? 'error' : 'info');
            }}
          />

          {openEscalations.length > 0 && (
            <div style={{ ...card, marginBottom: 18, borderLeft: '3px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 3 }}>Escalations</h3>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>Open team-lead requests awaiting HR review</p>
                </div>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>{openEscalations.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {openEscalations.map(item => (
                  <div key={item.id} style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: 12,
                    padding: '11px 12px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#991b1b' }}>
                        {item.targetName || 'Team staffing'}
                      </span>
                      <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        {item.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.45, margin: '0 0 8px' }}>
                      {item.notes || `Team absence at ${item.absencePct}%.`}
                    </p>
                    <button
                      onClick={() => {
                        resolveEscalation?.(item.id);
                        showToast('Escalation marked as resolved.', 'success');
                      }}
                      style={{
                        width: '100%', padding: '7px 9px', borderRadius: 8,
                        border: '1px solid #dc2626', background: 'white',
                        color: '#dc2626', fontFamily: 'inherit', fontSize: 11,
                        fontWeight: 800, cursor: 'pointer',
                      }}
                    >
                      Mark Resolved
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPI strip */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <LastUpdated />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
            {kpis.map(k => (
              <StatCard key={k.label} label={k.label} value={k.value} sub={k.sub} color={k.color} />
            ))}
          </div>

          {/* Live status + Risks side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 2fr minmax(260px, 1.3fr)', gap: 14, alignItems: 'start' }}>
            {/* Left col: Readiness Gauge + Live Status pie */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Readiness Score Gauge */}
              {(() => {
                const gaugeColor = readiness === 'RED' ? '#dc2626' : readiness === 'AMBER' ? '#d97706' : '#059669';
                const score = Math.round(readinessScore);
                const gaugeData = [{ value: score }, { value: 100 - score }];
                return (
                  <div style={{ ...card, textAlign: 'center', padding: '14px 18px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>Readiness Score</h3>
                      <button
                        onClick={() => setShowGaugeInfo(o => !o)}
                        title="How is this calculated?"
                        style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `1.5px solid ${showGaugeInfo ? gaugeColor : '#d1d5db'}`,
                          background: showGaugeInfo ? `${gaugeColor}15` : 'white',
                          color: showGaugeInfo ? gaugeColor : '#9ca3af',
                          fontSize: 11, fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, fontFamily: 'inherit', transition: 'all 0.15s',
                        }}
                      >?</button>
                    </div>
                    <div style={{ position: 'relative', marginTop: -4 }}>
                      <ResponsiveContainer width="100%" height={90}>
                        <PieChart>
                          <Pie
                            data={gaugeData}
                            cx="50%" cy="80%"
                            startAngle={180} endAngle={0}
                            innerRadius={38} outerRadius={52}
                            dataKey="value" stroke="none"
                          >
                            <Cell fill={gaugeColor} />
                            <Cell fill="#f3f4f6" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{
                        position: 'absolute', bottom: 8, left: '50%',
                        transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none',
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: gaugeColor, lineHeight: 1 }}>{score}</div>
                        <div style={{ fontSize: 9, color: '#9ca3af' }}>/ 100</div>
                      </div>
                    </div>
                    <div style={{
                      display: 'inline-block', fontSize: 10, fontWeight: 700,
                      padding: '2px 10px', borderRadius: 20,
                      background: `${gaugeColor}15`, color: gaugeColor, marginTop: 2,
                    }}>{readiness}</div>

                    {/* Explanation panel */}
                    {showGaugeInfo && (
                      <div style={{
                        marginTop: 10, textAlign: 'left',
                        background: '#fafafa', borderRadius: 10,
                        border: '1px solid #f3f4f6',
                        padding: '10px 12px',
                      }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7 }}>
                          How it's calculated
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {[
                            { label: 'Base score',          value: '100', color: '#059669' },
                            { label: 'Each Critical risk',  value: '−20', color: '#dc2626' },
                            { label: 'Each Warning risk',   value: '−8',  color: '#d97706' },
                            { label: 'Per 1% above 8% abs.', value: '−2', color: '#6366f1' },
                          ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 10, color: '#6b7280' }}>{r.label}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.value}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 8, paddingTop: 7, borderTop: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 10, color: '#9ca3af' }}>Your current score</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: gaugeColor }}>{score} / 100</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Live Staff Status */}
              <div style={card}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4, textAlign: 'center' }}>Live Status</h3>
                <div style={{ position: 'relative' }}>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={54}
                        dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none',
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>{staffStatus.available}%</div>
                    <div style={{ fontSize: 9, color: '#6b7280' }}>Available</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
                  {pieData.map(item => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: '#6b7280', flex: 1 }}>{item.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#1e1b4b' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 3 }}>Risk Management</h3>
                  <p style={{ fontSize: 10, color: '#9ca3af' }}>Sorted risks generated from live staffing, absence, and site data</p>
                </div>
                <span style={{ fontSize: 20, fontWeight: 900, color: criticalAlerts ? '#dc2626' : warningAlerts ? '#d97706' : '#059669', lineHeight: 1 }}>
                  {riskSummary.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {riskSummary.length === 0 ? (
                  <EmptyState
                    title="No active risks"
                    message="Coverage and site status are within thresholds."
                  />
                ) : (
                  riskSummary.map(r => (
                    <div key={r.id} style={{
                      borderLeft: `3px solid ${r.color}`,
                      background: r.bg,
                      borderRadius: '0 12px 12px 0',
                      padding: '11px 14px',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <StatusBadge status={r.level} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{r.dept}</span>
                          </div>
                          <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.45, margin: '0 0 5px' }}>{r.issue}</p>
                          <span style={{ fontSize: 10, color: r.color, fontWeight: 800 }}>{r.source}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* High Risk Departments */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Department Coverage</h3>
              <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 14 }}>Departments sorted by coverage risk against minimum staffing</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sortedDeptCoverage.map(dept => {
                  const isActive = filterDept === dept.name;
                  const belowMin = dept.current < dept.min;
                  const isDeploying = deployTarget === dept.name;
                  const coverageStatus = getCoverageStatus(dept.current, dept.min);
                  const livePct = Math.round(dept.current / dept.min * 100);
                  return (
                    <div key={dept.name} style={{ borderRadius: 10, border: `1.5px solid ${isActive ? coverageStatus.color : belowMin ? '#fecdd3' : 'transparent'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
                      <div
                        onClick={() => { if (!isDeploying) { setFilterDept(isActive ? 'All' : dept.name); setActiveTab('analyse'); } }}
                        style={{
                          cursor: isDeploying ? 'default' : 'pointer',
                          padding: '8px 10px',
                          background: isActive ? `${coverageStatus.color}08` : belowMin ? '#fff1f2' : 'transparent',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? coverageStatus.color : '#1e1b4b' }}>{dept.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StatusBadge status={coverageStatus.level} />
                            {belowMin && !isDeploying && (
                              <button
                                onClick={e => { e.stopPropagation(); setDeployTarget(dept.name); setDeployAmount(Math.max(1, dept.min - dept.current)); }}
                                style={{
                                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                                  border: '1.5px solid #dc2626', background: '#fff1f2',
                                  color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit',
                                }}
                              >Deploy Reserve</button>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(livePct, 100)}%`, height: '100%', background: coverageStatus.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: coverageStatus.color, width: 32, textAlign: 'right' }}>{livePct}%</span>
                        </div>
                        <div style={{ fontSize: 10, color: belowMin ? '#dc2626' : '#9ca3af', fontWeight: belowMin ? 700 : 400 }}>
                          {dept.current} present / min. {dept.min} required
                          {belowMin && <span style={{ marginLeft: 5 }}>⚠ {dept.min - dept.current} below</span>}
                        </div>
                      </div>

                      {/* Inline deploy panel */}
                      {isDeploying && (
                        <div style={{ padding: '10px 10px 12px', background: '#fafafa', borderTop: '1px solid #fee2e2' }}
                          onClick={e => e.stopPropagation()}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                            Deploy reserve staff to <strong>{dept.name}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <button onClick={() => setDeployAmount(a => Math.max(1, a - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#374151' }}>−</button>
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#1e1b4b', minWidth: 20, textAlign: 'center' }}>{deployAmount}</span>
                            <button onClick={() => setDeployAmount(a => Math.min(20, a + 1))} style={{ width: 26, height: 26, borderRadius: 6, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#374151' }}>+</button>
                            <span style={{ fontSize: 11, color: '#6b7280' }}>staff</span>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setDeployTarget(null)} style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Cancel</button>
                            <button onClick={() => {
                              setDeptCoverage(prev => prev.map(d => d.name === dept.name
                                ? { ...d, current: d.current + deployAmount }
                                : d
                              ));
                              setDeployTarget(null);
                              showToast(`${deployAmount} reserve staff deployed to ${dept.name}.`, 'success');
                              addNotification?.('teamlead', `${deployAmount} reserve staff deployed to ${dept.name}`, 'success');
                            }} style={{ flex: 2, padding: '7px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 700 }}>
                              Confirm Deployment
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Alert Staff panel */}
          <div style={{ ...card, marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📢</div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>Alert Staff</h3>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>Send a dashboard announcement to employees</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              {[
                { key: 'alert',   label: '🏢 Site closure',       text: 'Your site has a change in operational status. Please check the site status strip for updates.' },
                { key: 'warning', label: '⚠️ High absence',        text: 'Absence levels are above threshold today. Please ensure your status is up to date.' },
                { key: 'info',    label: '📋 Policy reminder',     text: 'Reminder: all WFH days must be logged in the system before 9am.' },
                { key: 'success', label: '✓ Situation resolved',   text: 'The staffing situation has been resolved. Normal operations resume.' },
              ].map(t => (
                <button key={t.key} onClick={() => { setAlertMsg(t.text); setAlertType(t.key); }} style={{
                  fontSize: 11, padding: '5px 12px', borderRadius: 20,
                  border: `1.5px solid ${alertType === t.key && alertMsg === t.text ? '#7c3aed' : '#e5e7eb'}`,
                  background: alertType === t.key && alertMsg === t.text ? 'rgba(124,58,237,0.08)' : 'white',
                  color: alertType === t.key && alertMsg === t.text ? '#7c3aed' : '#6b7280',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.12s',
                }}>{t.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <textarea
                value={alertMsg}
                onChange={e => setAlertMsg(e.target.value)}
                placeholder="Type a custom message or pick a template above…"
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 12,
                  resize: 'none', height: 52, outline: 'none', color: '#374151',
                }}
              />
              <button
                disabled={!alertMsg.trim()}
                onClick={() => {
                  const icons = { alert: '🏢', warning: '⚠️', info: '📋', success: '✓' };
                  pushStaffAnnouncement?.(alertMsg.trim(), alertType, icons[alertType] || '📢');
                  showToast('Announcement sent to all staff.', 'success');
                  setAlertMsg('');
                }}
                style={{
                  padding: '10px 18px', borderRadius: 10, border: 'none', flexShrink: 0,
                  background: alertMsg.trim() ? 'linear-gradient(135deg, #7c3aed, #db2777)' : '#e5e7eb',
                  color: alertMsg.trim() ? 'white' : '#9ca3af',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
                  cursor: alertMsg.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: alertMsg.trim() ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                  transition: 'all 0.15s',
                }}
              >Send Alert</button>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB: ANALYSE ──────────────────────────────────────────────── */}
      {activeTab === 'analyse' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          {/* Filter bar */}
          <div style={{ ...card, padding: '14px 18px', marginBottom: 18, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>Department</span>
              {['All', ...deptNames].map(d => filterPill(filterDept === d, () => setFilterDept(d), d))}
            </div>
            <div style={{ width: 1, height: 22, background: '#e5e7eb', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>Period</span>
              {PERIODS.map(p => filterPill(filterPeriod === p.key, () => setFilterPeriod(p.key), p.label))}
            </div>
          </div>

          {/* Dept drill-down summary bar */}
          {drillDept && (() => {
            const total = drillDept.inOffice + drillDept.wfh + drillDept.absent + drillDept.onLeave;
            const rate = Math.round(drillDept.absent / total * 100);
            return (
              <div style={{
                ...card, marginBottom: 18, padding: '14px 20px',
                background: 'linear-gradient(135deg, rgba(237,233,254,0.7), rgba(252,231,243,0.7))',
                border: '1.5px solid #c4b5fd',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#7c3aed' }}>{drillDept.dept}</span>
                    <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 8 }}>drill-down</span>
                  </div>
                  {[
                    { label: 'In Office', value: drillDept.inOffice, color: '#6366f1' },
                    { label: 'WFH',       value: drillDept.wfh,      color: '#8b5cf6' },
                    { label: 'Absent',    value: drillDept.absent,    color: '#f472b6' },
                    { label: 'On Leave',  value: drillDept.onLeave,   color: '#a5b4fc' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</span>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>Absence rate</div>
                    <div style={{
                      fontSize: 20, fontWeight: 900, lineHeight: 1.1,
                      color: rate > 25 ? '#dc2626' : rate > 15 ? '#d97706' : '#059669',
                    }}>{rate}%</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Org snapshot */}
          <div style={{ ...card, marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>
                {filterDept === 'All' ? 'Organisation Absence Snapshot' : `${filterDept} — Absence Snapshot`}
              </h3>
              <div style={{ display: 'flex', gap: 3, background: '#f3f4f6', borderRadius: 10, padding: 3 }}>
                {viewBtn('bar', 'Chart')}
                {viewBtn('table', 'Table')}
              </div>
            </div>
            {snapshotView === 'bar' ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={filteredSnapshot} barCategoryGap="22%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="inOffice" name="In Office" fill="#6366f1" radius={[3,3,0,0]} />
                  <Bar dataKey="wfh"      name="WFH"       fill="#8b5cf6" radius={[3,3,0,0]} />
                  <Bar dataKey="absent"   name="Absent"    fill="#f472b6" radius={[3,3,0,0]} />
                  <Bar dataKey="onLeave"  name="On Leave"  fill="#a5b4fc" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <OrgSnapshotTable data={filteredSnapshot} />
            )}
          </div>

          {/* Trend + World map */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 14, alignItems: 'start' }}>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>Absence Trend</h3>
                <div style={{ display: 'flex', gap: 4 }}>
                  {PERIODS.map(p => (
                    <button key={p.key} onClick={() => setFilterPeriod(p.key)} style={{
                      padding: '3px 8px', borderRadius: 6, border: 'none',
                      background: filterPeriod === p.key ? '#2563eb' : '#f3f4f6',
                      color: filterPeriod === p.key ? 'white' : '#6b7280',
                      fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{p.label.replace('This ', '')}</button>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>Dashed line = 15% threshold</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activeTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={v => [`${v}%`, 'Absence']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                  <ReferenceLine y={15} stroke="#10b981" strokeDasharray="4 2" strokeWidth={1.5} />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5}
                    dot={{ fill: '#2563eb', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              {(() => {
                const first = activeTrend[0].value;
                const last  = activeTrend[activeTrend.length - 1].value;
                const pct   = Math.round(Math.abs(last - first) / first * 100);
                const up    = last > first;
                return (
                  <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 10,
                    background: up ? '#fff1f2' : '#f0fdf4',
                    border: `1px solid ${up ? '#fecdd3' : '#bbf7d0'}`,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: up ? '#dc2626' : '#059669' }}>
                      {up ? '↑ Trending up' : '↓ Trending down'}
                    </span>
                    <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 6 }}>
                      {up ? '+' : '-'}{pct}% — {up ? 'review advised' : 'improving'}
                    </span>
                  </div>
                );
              })()}
            </div>

            <div style={card}>
              <WorldMap sites={activeSites} title="Global Site Status" />
            </div>
          </div>

          {/* Stacked workforce distribution + Return forecast */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, marginTop: 14, alignItems: 'start' }}>
            {/* Stacked workforce distribution */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Workforce Distribution</h3>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>Workforce split by office, WFH, absence, and leave</p>
                </div>
                <div style={{ display: 'flex', gap: 3, background: '#f3f4f6', borderRadius: 10, padding: 3 }}>
                  {PERIODS.map(p => (
                    <button key={p.key} onClick={() => setStackedPeriod(p.key)} style={{
                      padding: '4px 10px', borderRadius: 7, border: 'none',
                      background: stackedPeriod === p.key ? '#7c3aed' : 'transparent',
                      color: stackedPeriod === p.key ? 'white' : '#6b7280',
                      fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{p.label.replace('This ', '')}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={workforceTrendStacked[stackedPeriod]} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="inOffice" name="In Office" stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
                  <Bar dataKey="wfh"      name="WFH"       stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="absent"   name="Absent"    stackId="a" fill="#f472b6" />
                  <Bar dataKey="onLeave"  name="On Leave"  stackId="a" fill="#a5b4fc" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Return forecast */}
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Return Forecast</h3>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>Expected returns from absence or leave</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={returnForecast} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="label" type="category" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} axisLine={false} tickLine={false} width={62} />
                  <Tooltip formatter={(v) => [`${v} staff`, 'Returning']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="returning" name="Returning" fill="#10b981" radius={[0,4,4,0]}>
                    {returnForecast.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#059669' : i === returnForecast.length - 1 ? '#34d399' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>
                  {returnForecast.reduce((s, d) => s + d.returning, 0)} staff
                </span>
                <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 5 }}>returning across the next 5 periods</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: REPORTS ──────────────────────────────────────────────── */}
      {activeTab === 'reports' && (
        <div style={{ animation: 'slideUp 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>

            {/* Report builder */}
            <div style={card}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Configure Report</h3>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Select options and download for leadership.</p>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Report Type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {REPORT_TYPES.map(r => (
                    <label key={r.key} onClick={() => setReportType(r.key)} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                      background: reportType === r.key ? 'rgba(124,58,237,0.07)' : '#fafafa',
                      border: `1.5px solid ${reportType === r.key ? '#7c3aed' : 'transparent'}`,
                      transition: 'all 0.15s',
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${reportType === r.key ? '#7c3aed' : '#d1d5db'}`,
                        background: reportType === r.key ? '#7c3aed' : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {reportType === r.key && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: reportType === r.key ? 700 : 500, color: reportType === r.key ? '#7c3aed' : '#374151' }}>
                        {r.key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Period</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {[{ key: 'today', label: 'Today' }, ...PERIODS].map(p => reportPill(reportPeriod === p.key, () => setReportPeriod(p.key), p.label))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Department</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {['All Departments', ...deptNames].map(d => reportPill(reportScope === d, () => setReportScope(d), d))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Format</div>
                <div style={{ display: 'flex', gap: 7 }}>
                  {REPORT_FORMATS.map(f => reportPill(reportFormat === f, () => setReportFormat(f), f))}
                </div>
              </div>

              <button onClick={handleGenerate} disabled={reportLoading} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: reportLoading ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                cursor: reportLoading ? 'not-allowed' : 'pointer',
                boxShadow: reportLoading ? 'none' : '0 4px 16px rgba(124,58,237,0.35)',
                transition: 'all 0.2s',
              }}>
                {reportLoading ? 'Generating…' : `Download ${reportFormat}`}
              </button>
            </div>

            {/* Report preview / description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                ...card,
                background: 'linear-gradient(145deg, rgba(237,233,254,0.5), rgba(252,231,243,0.3))',
                border: '1.5px solid #e9d5ff',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                  Selected Report
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed', marginBottom: 8 }}>{reportType}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>{selectedReportDesc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { label: reportScope, color: '#7c3aed' },
                    { label: PERIODS.find(p => p.key === reportPeriod)?.label ?? 'Today', color: '#db2777' },
                    { label: reportFormat, color: '#059669' },
                  ].map(tag => (
                    <span key={tag.label} style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: `${tag.color}15`, color: tag.color,
                    }}>{tag.label}</span>
                  ))}
                </div>
              </div>

              {/* Recent data summary for context */}
              <div style={card}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
                  Current Snapshot
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {kpis.map(k => (
                    <StatCard key={k.label} label={k.label} value={k.value} color={k.color} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
