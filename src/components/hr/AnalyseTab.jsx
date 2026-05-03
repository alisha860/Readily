import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ReferenceLine, Tooltip, ResponsiveContainer,
} from 'recharts';
import WorldMap from '../WorldMap';
import { card } from '../shared';

const PERIODS = [
  { key: 'week',    label: 'This Week' },
  { key: 'month',   label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
];

// Pill filter button helper — scoped to this tab only.
function FilterPill({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{
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
}

function ViewToggleBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 11px', borderRadius: 8, border: 'none',
      background: active ? '#7c3aed' : 'transparent',
      color: active ? 'white' : '#6b7280',
      fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    }}>{label}</button>
  );
}

function OrgSnapshotTable({ data }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 4 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
            {['Department', 'In Office', 'WFH', 'Absent', 'On Leave', 'Abs. Rate'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Department' ? 'left' : 'right', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            const total   = d.inOffice + d.wfh + d.absent + d.onLeave;
            const absRate = Math.round(d.absent / total * 100);
            return (
              <tr key={d.dept} style={{ borderBottom: '1px solid #f9fafb', background: i % 2 === 0 ? 'transparent' : '#fafafa' }}>
                <td style={{ padding: '10px', fontWeight: 700, color: '#1e1b4b' }}>{d.dept}</td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#6366f1', fontWeight: 600 }}>{d.inOffice}</td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#8b5cf6', fontWeight: 600 }}>{d.wfh}</td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#f472b6', fontWeight: 600 }}>{d.absent}</td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#a5b4fc', fontWeight: 600 }}>{d.onLeave}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11,
                    background: absRate > 25 ? '#fee2e2' : absRate > 15 ? '#fef3c7' : '#d1fae5',
                    color:      absRate > 25 ? '#991b1b' : absRate > 15 ? '#92400e' : '#065f46',
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

export default function AnalyseTab({
  filterDept, setFilterDept, filterPeriod, setFilterPeriod,
  deptNames, filteredSnapshot, drillDept,
  activeTrend, snapshotView, setSnapshotView,
  stackedPeriod, setStackedPeriod,
  activeSites, workforceTrendStacked, returnForecast,
}) {
  return (
    <div style={{ animation: 'slideUp 0.2s ease' }}>

      {/* Filter bar */}
      <div style={{ ...card, padding: '14px 18px', marginBottom: 18, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>Department</span>
          {['All', ...deptNames].map(d => (
            <FilterPill key={d} active={filterDept === d} onClick={() => setFilterDept(d)} label={d} />
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: '#e5e7eb', flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>Period</span>
          {PERIODS.map(p => (
            <FilterPill key={p.key} active={filterPeriod === p.key} onClick={() => setFilterPeriod(p.key)} label={p.label} />
          ))}
        </div>
      </div>

      {/* Dept drill-down summary */}
      {drillDept && (() => {
        const total = drillDept.inOffice + drillDept.wfh + drillDept.absent + drillDept.onLeave;
        const rate  = Math.round(drillDept.absent / total * 100);
        return (
          <div style={{ ...card, marginBottom: 18, padding: '14px 20px', background: 'linear-gradient(135deg,rgba(237,233,254,0.7),rgba(252,231,243,0.7))', border: '1.5px solid #c4b5fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#7c3aed' }}>{drillDept.dept}</span>
                <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 8 }}>drill-down</span>
              </div>
              {[
                { label: 'In Office', value: drillDept.inOffice, color: '#6366f1' },
                { label: 'WFH',       value: drillDept.wfh,     color: '#8b5cf6' },
                { label: 'Absent',    value: drillDept.absent,   color: '#f472b6' },
                { label: 'On Leave',  value: drillDept.onLeave,  color: '#a5b4fc' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>Absence rate</div>
                <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.1, color: rate > 25 ? '#dc2626' : rate > 15 ? '#d97706' : '#059669' }}>{rate}%</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Organisation Absence Snapshot */}
      <div style={{ ...card, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>
            {filterDept === 'All' ? 'Organisation Absence Snapshot' : `${filterDept} — Absence Snapshot`}
          </h3>
          <div style={{ display: 'flex', gap: 3, background: '#f3f4f6', borderRadius: 10, padding: 3 }}>
            <ViewToggleBtn active={snapshotView === 'bar'} onClick={() => setSnapshotView('bar')} label="Chart" />
            <ViewToggleBtn active={snapshotView === 'table'} onClick={() => setSnapshotView('table')} label="Table" />
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

      {/* Absence Trend + Return Forecast (left) | World Map (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 14, marginBottom: 14 }}>
        {/* Left column — stacked so the two cards fill the map's height */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Absence Trend */}
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
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            {(() => {
              const first = activeTrend[0].value;
              const last  = activeTrend[activeTrend.length - 1].value;
              const pct   = Math.round(Math.abs(last - first) / first * 100);
              const up    = last > first;
              return (
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: up ? '#fff1f2' : '#f0fdf4', border: `1px solid ${up ? '#fecdd3' : '#bbf7d0'}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: up ? '#dc2626' : '#059669' }}>{up ? '↑ Trending up' : '↓ Trending down'}</span>
                  <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 6 }}>{up ? '+' : '-'}{pct}% — {up ? 'review advised' : 'improving'}</span>
                </div>
              );
            })()}
          </div>

          {/* Return Forecast — moved up to fill the left column */}
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 2 }}>Return Forecast</h3>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>Expected returns from absence or leave</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={returnForecast} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="label" type="category" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} axisLine={false} tickLine={false} width={62} />
                <Tooltip formatter={v => [`${v} staff`, 'Returning']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="returning" name="Returning" fill="#10b981" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>{returnForecast.reduce((s, d) => s + d.returning, 0)} staff</span>
              <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 5 }}>returning across the next two weeks</span>
            </div>
          </div>
        </div>

        {/* Right — World Map */}
        <div style={card}><WorldMap sites={activeSites} title="Global Site Status" /></div>
      </div>

      {/* Workforce Distribution — full width */}
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
            <Bar dataKey="inOffice" name="In Office" stackId="a" fill="#6366f1" />
            <Bar dataKey="wfh"      name="WFH"       stackId="a" fill="#8b5cf6" />
            <Bar dataKey="absent"   name="Absent"    stackId="a" fill="#f472b6" />
            <Bar dataKey="onLeave"  name="On Leave"  stackId="a" fill="#a5b4fc" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
