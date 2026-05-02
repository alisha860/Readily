import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { card, StatCard, StatusBadge, EmptyState, LastUpdated } from '../shared';
import { getCoverageStatus } from '../../utils/statusUtils';

const PIE_COLORS = {
  inOffice: '#6366f1', wfh: '#8b5cf6', absent: '#f472b6', onLeave: '#a5b4fc',
};

export default function OverviewTab({
  kpis, staffStatus, pieData, absenceRate,
  readiness, readinessScore, showGaugeInfo, setShowGaugeInfo,
  riskSummary, criticalAlerts, warningAlerts,
  sortedDeptCoverage, deployTarget, setDeployTarget, deployAmount, setDeployAmount, setDeptCoverage,
  openEscalations,
  alertMsg, setAlertMsg, alertType, setAlertType,
  setActiveTab, setFilterDept,
  showToast, pushStaffAnnouncement, addNotification, resolveEscalation,
}) {
  const gaugeColor = readiness === 'RED' ? '#dc2626' : readiness === 'AMBER' ? '#d97706' : '#059669';
  const gaugeScore = Math.round(readinessScore);
  const gaugeData  = [{ value: gaugeScore }, { value: 100 - gaugeScore }];

  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>

      {/* Open escalations panel */}
      {openEscalations.length > 0 && (
        <div style={{ ...card, marginBottom: 18, borderLeft: '3px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', marginBottom: 3 }}>Escalations</h3>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>Open team-lead requests awaiting HR review</p>
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>{openEscalations.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
            {openEscalations.map(item => (
              <div key={item.id} style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 12, padding: '11px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#991b1b' }}>{item.targetName || 'Team staffing'}</span>
                  <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    {item.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.45, margin: '0 0 8px' }}>
                  {item.notes || `Team absence at ${item.absencePct}%.`}
                </p>
                <button
                  onClick={() => { resolveEscalation?.(item.id); showToast('Escalation marked as resolved.', 'success'); }}
                  style={{
                    width: '100%', padding: '7px 9px', borderRadius: 8,
                    border: '1px solid #dc2626', background: 'white',
                    color: '#dc2626', fontFamily: 'inherit', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  }}
                >Mark Resolved</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI strip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}><LastUpdated /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {kpis.map(k => <StatCard key={k.label} label={k.label} value={k.value} sub={k.sub} color={k.color} />)}
      </div>

      {/* Readiness + Live Status | Risk Management | Department Coverage */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px,1fr) 2fr minmax(260px,1.3fr)', gap: 14, alignItems: 'start' }}>

        {/* Left column: Readiness gauge + Live Status pie */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Readiness Score gauge */}
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
                  <Pie data={gaugeData} cx="50%" cy="80%" startAngle={180} endAngle={0}
                    innerRadius={38} outerRadius={52} dataKey="value" stroke="none">
                    <Cell fill={gaugeColor} />
                    <Cell fill="#f3f4f6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: gaugeColor, lineHeight: 1 }}>{gaugeScore}</div>
                <div style={{ fontSize: 9, color: '#9ca3af' }}>/ 100</div>
              </div>
            </div>
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: `${gaugeColor}15`, color: gaugeColor, marginTop: 2 }}>
              {readiness}
            </div>
            {showGaugeInfo && (
              <div style={{ marginTop: 10, textAlign: 'left', background: '#fafafa', borderRadius: 10, border: '1px solid #f3f4f6', padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7 }}>How it's calculated</p>
                {[
                  { label: 'Base score',           value: '100', color: '#059669' },
                  { label: 'Each Critical risk',   value: '−20', color: '#dc2626' },
                  { label: 'Each Warning risk',    value: '−8',  color: '#d97706' },
                  { label: 'Per 1% above 8% abs.', value: '−2',  color: '#6366f1' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>{r.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, paddingTop: 7, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>Your score</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: gaugeColor }}>{gaugeScore} / 100</span>
                </div>
              </div>
            )}
          </div>

          {/* Live Status donut */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4, textAlign: 'center' }}>Live Status</h3>
            <div style={{ position: 'relative' }}>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={54}
                    dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
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
              <p style={{ fontSize: 10, color: '#9ca3af' }}>Risks generated from live staffing, absence, site data</p>
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: criticalAlerts ? '#dc2626' : warningAlerts ? '#d97706' : '#059669', lineHeight: 1 }}>
              {riskSummary.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {riskSummary.length === 0
              ? <EmptyState title="No active risks" message="Coverage and site status are within thresholds." />
              : riskSummary.map(r => (
                  <div key={r.id} style={{ borderLeft: `3px solid ${r.color}`, background: r.bg, borderRadius: '0 12px 12px 0', padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <StatusBadge status={r.level} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{r.dept}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.45, margin: '0 0 5px' }}>{r.issue}</p>
                    <span style={{ fontSize: 10, color: r.color, fontWeight: 800 }}>{r.source}</span>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Department Coverage */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Department Coverage</h3>
          <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 14 }}>Departments sorted by coverage risk against minimum staffing</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedDeptCoverage.map(dept => {
              const belowMin       = dept.current < dept.min;
              const isDeploying    = deployTarget === dept.name;
              const coverageStatus = getCoverageStatus(dept.current, dept.min);
              const livePct        = Math.round(dept.current / dept.min * 100);
              return (
                <div key={dept.name} style={{ borderRadius: 10, border: `1.5px solid ${belowMin ? '#fecdd3' : 'transparent'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
                  <div
                    onClick={() => { if (!isDeploying) { setFilterDept(dept.name); setActiveTab('analyse'); } }}
                    style={{ cursor: isDeploying ? 'default' : 'pointer', padding: '8px 10px', background: belowMin ? '#fff1f2' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b' }}>{dept.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StatusBadge status={coverageStatus.level} />
                        {belowMin && !isDeploying && (
                          <button
                            onClick={e => { e.stopPropagation(); setDeployTarget(dept.name); setDeployAmount(Math.max(1, dept.min - dept.current)); }}
                            style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, border: '1.5px solid #dc2626', background: '#fff1f2', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
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
                    <div style={{ padding: '10px 10px 12px', background: '#fafafa', borderTop: '1px solid #fee2e2' }} onClick={e => e.stopPropagation()}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                        Deploy reserve staff to <strong>{dept.name}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <button onClick={() => setDeployAmount(a => Math.max(1, a - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>−</button>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#1e1b4b', minWidth: 20, textAlign: 'center' }}>{deployAmount}</span>
                        <button onClick={() => setDeployAmount(a => Math.min(20, a + 1))} style={{ width: 26, height: 26, borderRadius: 6, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>+</button>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>staff</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setDeployTarget(null)} style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Cancel</button>
                        <button onClick={() => {
                          setDeptCoverage(prev => prev.map(d => d.name === dept.name ? { ...d, current: d.current + deployAmount } : d));
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
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📢</div>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>Alert Staff</h3>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>Send a dashboard announcement to employees</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {[
            { key: 'alert',   label: 'Site closure',       text: 'Your site has a change in operational status. Please check the site status strip for updates.' },
            { key: 'warning', label: 'High absence',        text: 'Absence levels are above threshold today. Please ensure your status is up to date.' },
            { key: 'info',    label: 'Policy reminder',     text: 'Reminder: all WFH days must be logged in the system before 9am.' },
            { key: 'success', label: 'Situation resolved',  text: 'The staffing situation has been resolved. Normal operations resume.' },
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
            style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'inherit', fontSize: 12, resize: 'none', height: 52, outline: 'none', color: '#374151' }}
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
              background: alertMsg.trim() ? 'linear-gradient(135deg,#7c3aed,#db2777)' : '#e5e7eb',
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
  );
}
