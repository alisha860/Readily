import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ReferenceLine,
} from 'recharts';
import WorldMap from './WorldMap';
import { HR_DATA } from '../data';

const card = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
  border: '1px solid rgba(255,255,255,0.9)',
  padding: 18,
};

const PIE_COLORS = {
  inOffice: '#6366f1',
  wfh: '#8b5cf6',
  absent: '#f472b6',
  onLeave: '#a5b4fc',
};

function StatusBadge({ status }) {
  const colors = {
    Stable: { bg: '#d1fae5', text: '#065f46' },
    Warning: { bg: '#fef3c7', text: '#92400e' },
    Critical: { bg: '#fee2e2', text: '#991b1b' },
    Monitor: { bg: '#dbeafe', text: '#1e40af' },
  };
  const c = colors[status] || colors.Monitor;
  return (
    <span style={{
      background: c.bg, color: c.text,
      fontSize: 10, fontWeight: 700, padding: '2px 8px',
      borderRadius: 20, letterSpacing: '0.3px',
    }}>{status}</span>
  );
}

function ReportModal({ onClose }) {
  const [type, setType] = useState('Full Workforce Report');
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 20, padding: 32,
        maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.25s ease',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Generate Report</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
          Select a report type to export your workforce readiness data.
        </p>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Report Type</label>
        <select
          value={type} onChange={e => setType(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '1.5px solid #e5e7eb', marginTop: 6, marginBottom: 16,
            fontFamily: 'inherit', fontSize: 13, outline: 'none',
          }}
        >
          <option>Full Workforce Report</option>
          <option>Absence Analysis Report</option>
          <option>Department Risk Report</option>
          <option>Site Status Report</option>
        </select>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e5e7eb',
            background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
          }}>Cancel</button>
          <button onClick={() => { alert(`"${type}" has been generated and is ready to download.`); onClose(); }} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
          }}>Generate PDF</button>
        </div>
      </div>
    </div>
  );
}

const CustomDotLabel = ({ cx, cy, percent, pct }) => null;

export default function HRDashboard({ user, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const { staffStatus, riskRecommendations, orgAbsenceSnapshot, interventions, highRiskDepts, absenceTrend, sites } = HR_DATA;

  const pieData = [
    { name: 'In Office', value: staffStatus.inOffice, color: PIE_COLORS.inOffice },
    { name: 'WFH', value: staffStatus.wfh, color: PIE_COLORS.wfh },
    { name: 'Absent', value: staffStatus.absent, color: PIE_COLORS.absent },
    { name: 'On Leave', value: staffStatus.onLeave, color: PIE_COLORS.onLeave },
  ];

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
            Good morning, {user.name}
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '11px 22px', borderRadius: 30, border: 'none',
            background: 'linear-gradient(135deg, #db2777, #7c3aed)',
            color: 'white', fontFamily: 'inherit', fontWeight: 700,
            fontSize: 13, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(219,39,119,0.35)',
          }}
        >
          Generate Report
        </button>
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.6fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Risk Recommendations */}
        <div style={{ ...card, background: 'linear-gradient(145deg, rgba(237,233,254,0.7), rgba(255,255,255,0.9))' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 12, textAlign: 'center' }}>
            Risk Recommendations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {riskRecommendations.map(r => (
              <div key={r.id} style={{
                background: r.bg, borderLeft: `3px solid ${r.color}`,
                borderRadius: '0 10px 10px 0', padding: '10px 10px 10px 12px',
              }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: r.color,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{r.level}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b', marginBottom: 3 }}>{r.dept}</div>
                <div style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.4 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Staff Status */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 4, textAlign: 'center' }}>
            Live Staff Status
          </h3>
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  innerRadius={48} outerRadius={66}
                  dataKey="value" stroke="none" startAngle={90} endAngle={-270}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontFamily: 'inherit', fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>{staffStatus.available}%</div>
              <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>Available</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', marginTop: 4 }}>
            {[
              { label: 'In Office', value: staffStatus.inOffice, color: PIE_COLORS.inOffice },
              { label: 'WFH', value: staffStatus.wfh, color: PIE_COLORS.wfh },
              { label: 'Absent', value: staffStatus.absent, color: PIE_COLORS.absent },
              { label: 'On Leave', value: staffStatus.onLeave, color: PIE_COLORS.onLeave },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#6b7280' }}>{item.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#1e1b4b', marginLeft: 'auto' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Organisation Absence Snapshot */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textAlign: 'center' }}>
            Organisation Absence Snapshot
          </h3>
          <ResponsiveContainer width="100%" height={195}>
            <BarChart data={orgAbsenceSnapshot} barCategoryGap="22%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="inOffice" name="In Office" fill="#6366f1" radius={[3,3,0,0]} />
              <Bar dataKey="wfh" name="WFH" fill="#8b5cf6" radius={[3,3,0,0]} />
              <Bar dataKey="absent" name="Absent" fill="#f472b6" radius={[3,3,0,0]} />
              <Bar dataKey="onLeave" name="On Leave" fill="#a5b4fc" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommended Interventions */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 10, textAlign: 'center' }}>
            Recommended Interventions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {interventions.map(iv => (
              <div
                key={iv.id}
                style={{
                  borderLeft: `3px solid ${iv.color}`, background: iv.bg,
                  borderRadius: '0 10px 10px 0', padding: '9px 10px 9px 11px',
                  cursor: 'pointer', transition: 'opacity 0.15s',
                }}
                onClick={() => showToast(`Action taken: ${iv.title}`, iv.level === 'Critical' ? 'error' : iv.level === 'Stable' ? 'success' : 'warning')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#1e1b4b' }}>{iv.title}</span>
                  <StatusBadge status={iv.level} />
                </div>
                <p style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.4, margin: 0 }}>{iv.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr 1fr', gap: 16 }}>

        {/* High Risk Departments */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>
            High Risk Departments
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {highRiskDepts.map(dept => (
              <div key={dept.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b' }}>{dept.name}</span>
                  <StatusBadge status={dept.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${dept.pct}%`, height: '100%',
                      background: dept.color, borderRadius: 4,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: dept.color, width: 32, textAlign: 'right' }}>
                    {dept.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Closures */}
        <div style={card}>
          <WorldMap sites={sites} title="Site Closures" />
        </div>

        {/* 7-Day Absence Trend */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', marginBottom: 8 }}>
            7-Day Absence Trend
          </h3>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={absenceTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip formatter={v => [`${v}%`, 'Absence']} contentStyle={{ fontFamily: 'inherit', fontSize: 11, borderRadius: 8 }} />
              <ReferenceLine y={15} stroke="#10b981" strokeDasharray="4 2" strokeWidth={1.5} />
              <Line
                type="monotone" dataKey="value" stroke="#7c3aed"
                strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {showModal && <ReportModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
