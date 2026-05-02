import { useState } from 'react';
import SiteStatusStrip from './SiteStatusStrip';
import { TabBar, PageHeader } from './shared';
import { HR_DATA } from '../data';
import { buildRiskSummary, getCoverageStatus } from '../utils/statusUtils';
import OverviewTab from './hr/OverviewTab';
import AnalyseTab  from './hr/AnalyseTab';
import ReportsTab  from './hr/ReportsTab';

const PIE_COLORS = {
  inOffice: '#6366f1',
  wfh:      '#8b5cf6',
  absent:   '#f472b6',
  onLeave:  '#a5b4fc',
};

const RISK_ORDER = { Critical: 0, Warning: 1, Monitor: 2, Stable: 3 };

export default function HRDashboard({ user, showToast, employeeAbsent, employeeWFH, pushStaffAnnouncement, addNotification, escalations = [], resolveEscalation }) {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [filterDept,     setFilterDept]     = useState('All');
  const [filterPeriod,   setFilterPeriod]   = useState('week');
  const [snapshotView,   setSnapshotView]   = useState('bar');
  const [reportType,     setReportType]     = useState('Executive Summary');
  const [reportFormat,   setReportFormat]   = useState('PDF');
  const [reportPeriod,   setReportPeriod]   = useState('week');
  const [reportScope,    setReportScope]    = useState('All Departments');
  const [reportLoading,  setReportLoading]  = useState(false);
  const [stackedPeriod,  setStackedPeriod]  = useState('week');
  const [showGaugeInfo,  setShowGaugeInfo]  = useState(false);
  const [deptCoverage,   setDeptCoverage]   = useState(HR_DATA.highRiskDepts);
  const [activeSites,    setActiveSites]    = useState(HR_DATA.sites);
  const [deployTarget,   setDeployTarget]   = useState(null);
  const [deployAmount,   setDeployAmount]   = useState(5);
  const [alertMsg,       setAlertMsg]       = useState('');
  const [alertType,      setAlertType]      = useState('warning');

  const { staffStatus, orgAbsenceSnapshot, absenceTrendsByPeriod, workforceTrendStacked, returnForecast } = HR_DATA;

  const deptNames        = orgAbsenceSnapshot.map(d => d.dept);
  const filteredSnapshot = filterDept === 'All' ? orgAbsenceSnapshot : orgAbsenceSnapshot.filter(d => d.dept === filterDept);
  const activeTrend      = absenceTrendsByPeriod[filterPeriod];
  const drillDept        = filterDept !== 'All' ? orgAbsenceSnapshot.find(d => d.dept === filterDept) : null;

  const liveAbsent = staffStatus.absent + (employeeAbsent ? 1 : 0);
  const liveWFH    = staffStatus.wfh    + (employeeWFH    ? 1 : 0);

  const pieData = [
    { name: 'In Office', value: staffStatus.inOffice, color: PIE_COLORS.inOffice },
    { name: 'WFH',       value: liveWFH,              color: PIE_COLORS.wfh },
    { name: 'Absent',    value: liveAbsent,            color: PIE_COLORS.absent },
    { name: 'On Leave',  value: staffStatus.onLeave,   color: PIE_COLORS.onLeave },
  ];

  const absenceRate        = Math.round(liveAbsent / staffStatus.total * 1000) / 10;
  const riskSummary        = buildRiskSummary(deptCoverage, orgAbsenceSnapshot, activeSites);
  const sortedDeptCoverage = [...deptCoverage].sort((a, b) => (
    (RISK_ORDER[getCoverageStatus(a.current, a.min).level] ?? 99) -
    (RISK_ORDER[getCoverageStatus(b.current, b.min).level] ?? 99)
  ));
  const criticalAlerts   = riskSummary.filter(r => r.level === 'Critical').length;
  const warningAlerts    = riskSummary.filter(r => r.level === 'Warning').length;
  const operationalSites = activeSites.filter(s => s.status === 'open' || s.status === 'partial').length;
  const openEscalations  = escalations.filter(e => e.status === 'open');

  const unresolvedCritical = riskSummary.find(r => r.level === 'Critical');
  const unresolvedWarning  = riskSummary.some(r => r.level === 'Warning');
  const readiness = unresolvedCritical || absenceRate > 15 ? 'RED'
    : unresolvedWarning  || absenceRate > 10 ? 'AMBER'
    : 'GREEN';

  const readinessScore = Math.max(0, Math.min(100,
    100 - criticalAlerts * 20 - warningAlerts * 8 - Math.max(0, (absenceRate - 8) * 2)
  ));

  const kpis = [
    { label: 'Total Workforce',    value: String(staffStatus.total),               sub: 'employees',               color: '#7c3aed' },
    { label: 'Absence Rate Today', value: `${absenceRate}%`,                       sub: 'vs 8% weekly avg',        color: '#db2777' },
    { label: 'Critical Risks',     value: String(criticalAlerts),                  sub: 'from staffing and sites', color: '#dc2626' },
    { label: 'Sites Operational',  value: `${operationalSites}/${activeSites.length}`, sub: 'worldwide',           color: '#059669' },
  ];

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <PageHeader name={user.name} subtitle="HR Manager Dashboard" />

      {/* Live absence alert */}
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

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'overview', label: 'Overview', badge: criticalAlerts },
          { key: 'analyse',  label: 'Analyse' },
          { key: 'reports',  label: 'Reports' },
        ]}
      />

      {activeTab === 'overview' && (
        <>
          <SiteStatusStrip
            sites={activeSites}
            onViewMap={() => setActiveTab('analyse')}
            onStatusChange={(name, newStatus) => {
              setActiveSites(prev => prev.map(s => s.name === name ? { ...s, status: newStatus } : s));
              showToast(`${name} status updated to ${newStatus}.`, newStatus === 'closed' ? 'error' : 'info');
            }}
          />
          <OverviewTab
            kpis={kpis}
            staffStatus={staffStatus}
            pieData={pieData}
            absenceRate={absenceRate}
            readiness={readiness}
            readinessScore={readinessScore}
            showGaugeInfo={showGaugeInfo}
            setShowGaugeInfo={setShowGaugeInfo}
            riskSummary={riskSummary}
            criticalAlerts={criticalAlerts}
            warningAlerts={warningAlerts}
            sortedDeptCoverage={sortedDeptCoverage}
            deployTarget={deployTarget}
            setDeployTarget={setDeployTarget}
            deployAmount={deployAmount}
            setDeployAmount={setDeployAmount}
            setDeptCoverage={setDeptCoverage}
            openEscalations={openEscalations}
            alertMsg={alertMsg}
            setAlertMsg={setAlertMsg}
            alertType={alertType}
            setAlertType={setAlertType}
            setActiveTab={setActiveTab}
            setFilterDept={setFilterDept}
            showToast={showToast}
            pushStaffAnnouncement={pushStaffAnnouncement}
            addNotification={addNotification}
            resolveEscalation={resolveEscalation}
          />
        </>
      )}

      {activeTab === 'analyse' && (
        <AnalyseTab
          filterDept={filterDept}
          setFilterDept={setFilterDept}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          deptNames={deptNames}
          filteredSnapshot={filteredSnapshot}
          drillDept={drillDept}
          activeTrend={activeTrend}
          snapshotView={snapshotView}
          setSnapshotView={setSnapshotView}
          stackedPeriod={stackedPeriod}
          setStackedPeriod={setStackedPeriod}
          activeSites={activeSites}
          workforceTrendStacked={workforceTrendStacked}
          returnForecast={returnForecast}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsTab
          kpis={kpis}
          deptNames={deptNames}
          reportType={reportType}
          setReportType={setReportType}
          reportFormat={reportFormat}
          setReportFormat={setReportFormat}
          reportPeriod={reportPeriod}
          setReportPeriod={setReportPeriod}
          reportScope={reportScope}
          setReportScope={setReportScope}
          reportLoading={reportLoading}
          setReportLoading={setReportLoading}
          showToast={showToast}
        />
      )}
    </div>
  );
}
