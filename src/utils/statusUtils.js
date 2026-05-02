// ── Status and risk utility functions ────────────────────────────────────
// Used by HR dashboard to derive coverage status, dept absence rates,
// and the unified risk summary shown in the Risk Management panel.

const RISK_ORDER = { Critical: 0, Warning: 1, Monitor: 2, Stable: 3 };

/** Returns RAG status object based on how far current staffing is from min. */
export function getCoverageStatus(current, min) {
  if (current < min)        return { level: 'Critical', color: '#dc2626', bg: '#fff1f2' };
  if (current <= min + 5)   return { level: 'Warning',  color: '#d97706', bg: '#fffbeb' };
  return                           { level: 'Stable',   color: '#10b981', bg: '#f0fdf4' };
}

/** Returns absence rate % for a single department from the snapshot array. */
export function getDeptAbsenceRate(deptName, snapshot) {
  const dept = snapshot.find(d => d.dept === deptName);
  if (!dept) return 0;
  const total = dept.inOffice + dept.wfh + dept.absent + dept.onLeave;
  return total ? Math.round((dept.absent / total) * 100) : 0;
}

/**
 * Builds the sorted risk list shown in the Risk Management panel.
 * Sources: department coverage vs minimum staffing + site operational status.
 */
export function buildRiskSummary(deptCoverage, snapshot, sites) {
  const deptRisks = deptCoverage.flatMap(dept => {
    const coverage    = getCoverageStatus(dept.current, dept.min);
    const absenceRate = getDeptAbsenceRate(dept.name, snapshot);
    const risks       = [];
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
      risks.push({
        id: `absence-${dept.name}`, dept: dept.name, level: 'Warning',
        issue: `${dept.name} absence is ${absenceRate}%, above the 25% disruption trigger.`,
        source: 'Absence trend', color: '#d97706', bg: '#fffbeb',
      });
    }
    return risks;
  });

  const siteRisks = sites
    .filter(s => s.status === 'closed' || s.status === 'reduced')
    .map(s => ({
      id: `site-${s.name}`, dept: s.name,
      level: s.status === 'closed' ? 'Critical' : 'Warning',
      issue: `${s.name} site status is ${s.status}. Local staffing plans may need adjustment.`,
      source: 'Site operations',
      color: s.status === 'closed' ? '#dc2626' : '#d97706',
      bg:    s.status === 'closed' ? '#fff1f2' : '#fffbeb',
    }));

  return [...deptRisks, ...siteRisks].sort(
    (a, b) => (RISK_ORDER[a.level] ?? 99) - (RISK_ORDER[b.level] ?? 99)
  );
}

/** Colour helper for absence-rate text/badges. */
export function absRateColor(rate) {
  return rate > 25 ? '#dc2626' : rate > 15 ? '#d97706' : '#059669';
}
