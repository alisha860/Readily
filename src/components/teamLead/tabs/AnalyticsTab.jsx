import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
// AnalyticsTab: absence rate charts, threshold meter, team comparison, and WFH trend for Team Lead
import WorldMap from '../../WorldMap';
import { card } from '../../shared';

const COMPARISON_COLORS = ['#7c3aed', '#a5b4fc', '#c4b5fd'];

export default function AnalyticsTab({
  pieData, absentPct, absentCount, team,
  readiness, markerPos, greenEnd, amberEnd,
  comparisonData, wfhVsAbsentTrend, sites, siteAvailability,
  showToast,
}) {
  const bannerColor = readiness === 'RED'
    ? { bg: '#fff1f2', border: '#fecdd3', text: '#991b1b', btn: '#dc2626' }
    : readiness === 'AMBER'
    ? { bg: '#fffbeb', border: '#fde68a', text: '#92400e', btn: '#d97706' }
    : { bg: '#f0fdf4', border: '#bbf7d0', text: '#065f46', btn: null };

  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>
      {/* Readiness action banner */}
      <div style={{ ...card, marginBottom: 14, padding: '14px 18px', background: bannerColor.bg, border: `1.5px solid ${bannerColor.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: bannerColor.text, marginBottom: 3 }}>
              {readiness === 'RED'   ? 'Team absence is above threshold. Action required.'
               : readiness === 'AMBER' ? 'Team absence is approaching the limit. Monitor closely.'
               : 'Team is within safe thresholds. No action needed.'}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {absentCount} of {team.length} members absent today · {absentPct}% absence rate
              {readiness === 'RED'   ? ' · Immediate escalation to HR recommended' : ''}
              {readiness === 'AMBER' ? ' · Consider notifying HR if this continues' : ''}
            </div>
          </div>
          {bannerColor.btn && (
            <button
              onClick={() => showToast('Absence breach reported to HR.', readiness === 'RED' ? 'error' : 'warning')}
              style={{ padding: '10px 18px', borderRadius: 10, border: 'none', flexShrink: 0, background: bannerColor.btn, color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
            >{readiness === 'RED' ? 'Escalate to HR' : 'Report to HR'}</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Team Absence donut */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4, textAlign: 'center' }}>Team Absence Today</h3>
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={65}
                  dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} formatter={v => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#f472b6', lineHeight: 1 }}>{absentPct}%</div>
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

        {/* Absence Threshold meter */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 16, textAlign: 'center' }}>Absence Threshold</h3>
          <div style={{ padding: '0 8px' }}>
            <div style={{ display: 'flex', marginBottom: 5, fontSize: 10, fontWeight: 700, color: '#6b7280' }}>
              <span style={{ flex: greenEnd,               textAlign: 'center' }}>Green</span>
              <span style={{ flex: amberEnd - greenEnd,    textAlign: 'center' }}>Amber</span>
              <span style={{ flex: 100 - amberEnd,         textAlign: 'center' }}>Red</span>
            </div>
            <div style={{ display: 'flex', marginBottom: 8, fontSize: 9, color: '#9ca3af' }}>
              <span style={{ flex: greenEnd,               textAlign: 'center' }}>0–15%</span>
              <span style={{ flex: amberEnd - greenEnd,    textAlign: 'center' }}>16–25%</span>
              <span style={{ flex: 100 - amberEnd,         textAlign: 'center' }}>26%+</span>
            </div>
            <div style={{ position: 'relative', height: 14, borderRadius: 7, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: greenEnd,            background: '#10b981' }} />
              <div style={{ flex: amberEnd - greenEnd, background: '#f59e0b' }} />
              <div style={{ flex: 100 - amberEnd,      background: '#ef4444' }} />
            </div>
            <div style={{ position: 'relative', height: 12, marginTop: -7 }}>
              <div style={{ position: 'absolute', left: `${markerPos}%`, transform: 'translateX(-50%)', width: 18, height: 18, borderRadius: '50%', background: '#7c3aed', border: '3px solid white', boxShadow: '0 2px 6px rgba(124,58,237,0.5)' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: readiness === 'RED' ? '#dc2626' : readiness === 'AMBER' ? '#f59e0b' : '#10b981' }}>{absentPct}%</span>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                Current rate: <strong style={{ color: readiness === 'RED' ? '#dc2626' : readiness === 'AMBER' ? '#f59e0b' : '#10b981' }}>
                  {readiness === 'RED' ? 'Red' : readiness === 'AMBER' ? 'Amber' : 'Green'}
                </strong>
              </div>
            </div>
            <button
              onClick={() => showToast('Threshold report submitted to HR for review.', 'info')}
              style={{ width: '100%', marginTop: 14, padding: '9px', borderRadius: 10, border: '1.5px solid #db2777', background: 'white', color: '#db2777', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
            >Report to HR</button>
          </div>
        </div>

        {/* Team Absence Comparison */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textAlign: 'center' }}>Team Absence Comparison</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={comparisonData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
              <XAxis dataKey="team" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => [`${v}%`, 'Absence']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="value" name="Absence" radius={[6,6,0,0]}>
                {comparisonData.map((_, i) => <Cell key={i} fill={COMPARISON_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WFH vs Absent Trend + World Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14 }}>
        <div style={{ ...card, alignSelf: 'start' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>WFH vs Absent Trend</h3>
          <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>Weekly counts</p>
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
  );
}
