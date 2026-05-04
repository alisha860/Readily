// statusUtils.js: coverage and risk helpers used by HRDashboard to compute RAG status and risk lists

// RISK_ORDER maps severity levels to numbers so the final risk list can be sorted
// with Critical items always at the top
const RISK_ORDER = { Critical: 0, Warning: 1, Monitor: 2, Stable: 3 };

// getCoverageStatus returns a RAG level based on how close current staffing is to the minimum.
// A 5-person Warning buffer is intentional: without it a single absence could flip a dept
// between Critical and Stable on consecutive days, making the dashboard noisy and hard to act on.
// The buffer gives HR a small window to respond before the situation becomes truly critical.
export function getCoverageStatus(current, min) {
  if (current < min)        return { level: 'Critical', color: '#dc2626', bg: '#fff1f2' };
  if (current <= min + 5)   return { level: 'Warning',  color: '#d97706', bg: '#fffbeb' };
  return                           { level: 'Stable',   color: '#10b981', bg: '#f0fdf4' };
}

// getDeptAbsenceRate calculates absence as a percentage of total headcount in that department.
// All four categories are summed for the denominator so the rate reflects true headcount,
// not just people physically present, which would artificially inflate the percentage.
export function getDeptAbsenceRate(deptName, snapshot) {
  const dept = snapshot.find(d => d.dept === deptName);
  if (!dept) return 0;
  const total = dept.inOffice + dept.wfh + dept.absent + dept.onLeave;
  return total ? Math.round((dept.absent / total) * 100) : 0;
}

// buildRiskSummary aggregates risks from two independent sources: department coverage
// and site operational status. Keeping these separate means either can trigger an alert
// without the other: a site closure is a risk even if all depts are fully staffed.
//
// A dept at Stable coverage can still raise a Warning if absence >= 25%, because a high
// absence rate is a leading indicator that coverage may deteriorate in the coming days.
export function buildRiskSummary(deptCoverage, snapshot, sites) {
  const deptRisks = deptCoverage.flatMap(dept => {
    const coverage    = getCoverageStatus(dept.current, dept.min);
    const absenceRate = getDeptAbsenceRate(dept.name, snapshot);
    const risks       = [];
    // Append absence context to the issue message when relevant so HR can see both problems at once.
    const absCtx      = absenceRate >= 25 ? ` Absence is also high at ${absenceRate}%.` : '';

    if (coverage.level === 'Critical') {
      risks.push({
        id: `coverage-${dept.name}`, dept: dept.name, level: 'Critical',
        issue: `${dept.name} is ${dept.min - dept.current} below minimum staffing (${dept.current}/${dept.min}).${absCtx}`,
        source: 'Minimum staffing', color: coverage.color, bg: coverage.bg,
      });
    } else if (coverage.level === 'Warning') {
      risks.push({
        id: `coverage-${dept.name}`, dept: dept.name, level: 'Warning',
        issue: `${dept.name} has only ${dept.current - dept.min} people above minimum staffing.${absCtx}`,
        source: 'Thin cover', color: coverage.color, bg: coverage.bg,
      });
    } else if (absenceRate >= 25) {
      // Only raise an absence-trend warning if coverage is Stable: a Critical or Warning dept
      // already captures the problem, so we avoid raising duplicate risks for the same department.
      risks.push({
        id: `absence-${dept.name}`, dept: dept.name, level: 'Warning',
        issue: `${dept.name} absence is ${absenceRate}%, above the 25% disruption trigger.`,
        source: 'Absence trend', color: '#d97706', bg: '#fffbeb',
      });
    }
    return risks;
  });

  // Partial sites are Warning rather than Critical because some staff can still work there.
  // A full closure is Critical because it removes all on-site capacity from that location.
  const siteRisks = sites
    .filter(s => s.status === 'closed' || s.status === 'partial')
    .map(s => ({
      id: `site-${s.name}`, dept: s.name,
      level: s.status === 'closed' ? 'Critical' : 'Warning',
      issue: `${s.name} site is ${s.status === 'closed' ? 'closed' : 'partially open'}. Local staffing plans may need adjustment.`,
      source: 'Site operations',
      color: s.status === 'closed' ? '#dc2626' : '#d97706',
      bg:    s.status === 'closed' ? '#fff1f2' : '#fffbeb',
    }));

  // Merge both risk sources and sort so Critical always appears at the top of the panel.
  return [...deptRisks, ...siteRisks].sort(
    (a, b) => (RISK_ORDER[a.level] ?? 99) - (RISK_ORDER[b.level] ?? 99)
  );
}

// absRateColor maps an absence rate to a traffic-light colour, centralised here so the same
// thresholds are used consistently across every badge and table in the app.
export function absRateColor(rate) {
  return rate > 25 ? '#dc2626' : rate > 15 ? '#d97706' : '#059669';
}
