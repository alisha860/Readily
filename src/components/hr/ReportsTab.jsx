import { card, StatCard } from '../shared';

const PERIODS = [
  { key: 'today',   label: 'Today' },
  { key: 'week',    label: 'This Week' },
  { key: 'month',   label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
];

const REPORT_TYPES = [
  { key: 'Executive Summary',       desc: 'High-level snapshot of availability, absence rate, readiness score, and critical risks.' },
  { key: 'Full Workforce Report',   desc: 'Complete breakdown across all departments: in-office, WFH, absent, on leave, with trend analysis.' },
  { key: 'Absence Analysis',        desc: 'Absence, WFH, in-office, and leave patterns by department and time period.' },
  { key: 'Department Risk Report',  desc: 'Current department risk status based on minimum staffing, absence levels, and site disruption.' },
  { key: 'Minimum Staffing Coverage', desc: 'Coverage of departments that are below or close to minimum staffing thresholds.' },
  { key: 'Site Status Report',      desc: 'Operational status across all global sites with staffing levels per location.' },
];

const FORMATS = ['PDF', 'CSV', 'Excel'];

// Gradient pill for report options.
function ReportPill({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 20,
      border: active ? 'none' : '1.5px solid #e5e7eb',
      background: active ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'white',
      color: active ? 'white' : '#6b7280',
      fontSize: 12, fontWeight: active ? 700 : 500,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
    }}>{label}</button>
  );
}

export default function ReportsTab({
  kpis, deptNames,
  reportType, setReportType,
  reportFormat, setReportFormat,
  reportPeriod, setReportPeriod,
  reportScope, setReportScope,
  reportLoading, setReportLoading,
  showToast,
}) {
  const selectedDesc = REPORT_TYPES.find(r => r.key === reportType)?.desc ?? '';

  const handleGenerate = () => {
    setReportLoading(true);
    setTimeout(() => {
      setReportLoading(false);
      showToast(`"${reportType}" (${reportFormat}) generated — ${reportScope}, ${PERIODS.find(p => p.key === reportPeriod)?.label ?? reportPeriod}.`, 'success');
    }, 1600);
  };

  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>

        {/* Report builder */}
        <div style={card}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Configure Report</h3>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Select options and download</p>

          {/* Report type */}
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
                  <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: `2px solid ${reportType === r.key ? '#7c3aed' : '#d1d5db'}`, background: reportType === r.key ? '#7c3aed' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {reportType === r.key && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: reportType === r.key ? 700 : 500, color: reportType === r.key ? '#7c3aed' : '#374151' }}>{r.key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Period */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Period</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {PERIODS.map(p => <ReportPill key={p.key} active={reportPeriod === p.key} onClick={() => setReportPeriod(p.key)} label={p.label} />)}
            </div>
          </div>

          {/* Department */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Department</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['All Departments', ...deptNames].map(d => <ReportPill key={d} active={reportScope === d} onClick={() => setReportScope(d)} label={d} />)}
            </div>
          </div>

          {/* Format */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Format</div>
            <div style={{ display: 'flex', gap: 7 }}>
              {FORMATS.map(f => <ReportPill key={f} active={reportFormat === f} onClick={() => setReportFormat(f)} label={f} />)}
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

        {/* Preview panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...card, background: 'linear-gradient(145deg,rgba(237,233,254,0.5),rgba(252,231,243,0.3))', border: '1.5px solid #e9d5ff' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Selected Report</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed', marginBottom: 8 }}>{reportType}</h3>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>{selectedDesc}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: reportScope,  color: '#7c3aed' },
                { label: PERIODS.find(p => p.key === reportPeriod)?.label ?? 'Today', color: '#db2777' },
                { label: reportFormat, color: '#059669' },
              ].map(tag => (
                <span key={tag.label} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${tag.color}15`, color: tag.color }}>{tag.label}</span>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Current Snapshot</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {kpis.map(k => <StatCard key={k.label} label={k.label} value={k.value} color={k.color} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
