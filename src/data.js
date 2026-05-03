export const USERS = {
  hr: {
    id: 'hr',
    name: 'Alex',
    role: 'HR Manager',
    mode: 'HR Mode',
    initials: 'A',
    avatarBg: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
  },
  teamlead: {
    id: 'teamlead',
    name: 'Melissa',
    role: 'Team Lead',
    mode: 'Team Lead Mode',
    initials: 'M',
    avatarBg: 'linear-gradient(135deg, #db2777, #be185d)',
  },
  employee: {
    id: 'employee',
    name: 'Simone',
    role: 'Employee',
    mode: 'Employee Mode',
    initials: 'S',
    avatarBg: 'linear-gradient(135deg, #0891b2, #0e7490)',
  },
};

export const DISRUPTION_CONFIG = {
  absenceReasons: [
    { key: 'confirmed_positive', label: 'Confirmed Positive', category: 'health', color: '#dc2626' },
    { key: 'suspected', label: 'Suspected Illness', category: 'health', color: '#f97316' },
    { key: 'quarantine', label: 'Quarantine/Isolation', category: 'health', color: '#ea580c' },
    { key: 'exposure_isolation', label: 'Exposure (Precautionary)', category: 'health', color: '#fb923c' },
    { key: 'caregiving', label: 'Caregiving (School/Family Closure)', category: 'disruption', color: '#eab308' },
    { key: 'dependent_illness', label: 'Dependent Illness', category: 'disruption', color: '#84cc16' },
    { key: 'personal_leave', label: 'Personal Leave', category: 'standard', color: '#22c55e' },
    { key: 'annual_leave', label: 'Annual Leave', category: 'standard', color: '#16a34a' },
    { key: 'other', label: 'Other', category: 'standard', color: '#6b7280' },
  ],
  
  healthStatus: {
    healthy: { label: 'Healthy', color: '#10b981', icon: '✓' },
    symptomatic: { label: 'Symptomatic', color: '#f97316', icon: '⚠️' },
    confirmed: { label: 'Confirmed Positive', color: '#dc2626', icon: '🚫' },
    recovered: { label: 'Recovered', color: '#8b5cf6', icon: '✓' },
  },

  roleCriticality: {
    essential: { label: 'Essential (Minimum 90%)', threshold: 90, color: '#dc2626' },
    critical: { label: 'Critical (Minimum 70%)', threshold: 70, color: '#f59e0b' },
    standard: { label: 'Standard (Minimum 50%)', threshold: 50, color: '#10b981' },
  },

  departmentStaffing: [
    { name: 'Compliance', essential: 45, critical: 35, total: 100, criticality: 'essential' },
    { name: 'Operations', essential: 60, critical: 50, total: 100, criticality: 'critical' },
    { name: 'Wealth Mgmt', essential: 50, critical: 40, total: 100, criticality: 'critical' },
    { name: 'Technology', essential: 40, critical: 35, total: 100, criticality: 'standard' },
    { name: 'Risk', essential: 35, critical: 30, total: 100, criticality: 'essential' },
    { name: 'HR', essential: 40, critical: 30, total: 100, criticality: 'standard' },
  ],

  disruptionScenarios: [
    { name: 'Low Impact', absenceRate: 5, desc: 'Standard operations' },
    { name: 'Moderate', absenceRate: 15, desc: 'Some role adjustments needed' },
    { name: 'High Impact', absenceRate: 25, desc: 'Essential functions only' },
    { name: 'Severe Crisis', absenceRate: 40, desc: 'Backup plans activated' },
  ],
};

export const HR_DATA = {
  staffStatus: {
    available: 80,
    inOffice: 142,
    wfh: 88,
    absent: 38,
    onLeave: 22,
    total: 290,
  },
  orgAbsenceSnapshot: [
    { dept: 'Compliance', inOffice: 45, absent: 35, wfh: 15, onLeave: 5 },
    { dept: 'Operations', inOffice: 72, absent: 8, wfh: 14, onLeave: 6 },
    { dept: 'Wealth Mgmt', inOffice: 60, absent: 20, wfh: 16, onLeave: 4 },
    { dept: 'Technology', inOffice: 82, absent: 5, wfh: 10, onLeave: 3 },
    { dept: 'Risk', inOffice: 55, absent: 28, wfh: 12, onLeave: 5 },
    { dept: 'HR', inOffice: 68, absent: 12, wfh: 14, onLeave: 6 },
  ],
  highRiskDepts: [
    { name: 'Risk',       pct: 87, status: 'Stable',   color: '#10b981', current: 43, min: 35 },
    { name: 'Technology', pct: 94, status: 'Stable',   color: '#10b981', current: 47, min: 40 },
    { name: 'Wealth Mgmt',pct: 81, status: 'Stable',   color: '#10b981', current: 57, min: 50 },
    { name: 'Operations', pct: 67, status: 'Warning',  color: '#f59e0b', current: 48, min: 60 },
    { name: 'Compliance', pct: 83, status: 'Critical', color: '#ef4444', current: 38, min: 45 },
  ],
  absenceTrendsByPeriod: {
    week: [
      { label: 'Mon', value: 8 },
      { label: 'Tue', value: 10 },
      { label: 'Wed', value: 12 },
      { label: 'Thu', value: 14 },
      { label: 'Fri', value: 16 },
      { label: 'Sat', value: 18 },
      { label: 'Sun', value: 20 },
    ],
    month: [
      { label: 'Wk 1', value: 9 },
      { label: 'Wk 2', value: 12 },
      { label: 'Wk 3', value: 15 },
      { label: 'Wk 4', value: 18 },
    ],
    quarter: [
      { label: 'Jan', value: 7 },
      { label: 'Feb', value: 11 },
      { label: 'Mar', value: 16 },
    ],
  },
  sites: [
    { name: 'London', coords: [-0.1276, 51.5074], status: 'partial' },
    { name: 'New York', coords: [-74.006, 40.7128], status: 'open' },
    { name: 'Dubai', coords: [55.2708, 25.2048], status: 'open' },
    { name: 'Mumbai', coords: [72.8777, 19.076], status: 'reduced' },
    { name: 'Hong Kong', coords: [114.1694, 22.3193], status: 'reduced' },
    { name: 'Tokyo', coords: [139.6917, 35.6895], status: 'open' },
    { name: 'Sydney', coords: [151.2093, -33.8688], status: 'open' },
  ],
  workforceTrendStacked: {
    week: [
      { label: 'Mon', inOffice: 148, wfh: 82, absent: 35, onLeave: 25 },
      { label: 'Tue', inOffice: 145, wfh: 85, absent: 37, onLeave: 23 },
      { label: 'Wed', inOffice: 142, wfh: 88, absent: 38, onLeave: 22 },
      { label: 'Thu', inOffice: 138, wfh: 90, absent: 40, onLeave: 22 },
      { label: 'Fri', inOffice: 135, wfh: 94, absent: 38, onLeave: 23 },
      { label: 'Sat', inOffice: 40,  wfh: 28, absent: 12, onLeave: 5  },
      { label: 'Sun', inOffice: 38,  wfh: 30, absent: 10, onLeave: 4  },
    ],
    month: [
      { label: 'Wk 1', inOffice: 152, wfh: 78, absent: 32, onLeave: 28 },
      { label: 'Wk 2', inOffice: 148, wfh: 82, absent: 35, onLeave: 25 },
      { label: 'Wk 3', inOffice: 142, wfh: 88, absent: 38, onLeave: 22 },
      { label: 'Wk 4', inOffice: 135, wfh: 94, absent: 42, onLeave: 19 },
    ],
    quarter: [
      { label: 'Jan', inOffice: 158, wfh: 72, absent: 28, onLeave: 32 },
      { label: 'Feb', inOffice: 148, wfh: 82, absent: 35, onLeave: 25 },
      { label: 'Mar', inOffice: 135, wfh: 94, absent: 42, onLeave: 19 },
    ],
  },
  returnForecast: [
    { label: 'Tomorrow', returning: 4 },
    { label: 'Wed',      returning: 2 },
    { label: 'Thu',      returning: 6 },
    { label: 'Fri',      returning: 3 },
    { label: 'Next Wk',  returning: 8 },
  ],
};

export const TEAM_LEAD_DATA = {
  team: [
    { id: 1, name: 'Georgia Knight', status: 'available', initials: 'GK', daysAbsent: null, location: 'London', desk: 'L-A1', role: 'FCA Sign-off Lead', criticality: 'essential', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'wfh', Thu: 'office', Fri: 'office' } },
    { id: 2, name: 'Adela Manon', status: 'absent', initials: 'AM', daysAbsent: 14, reason: 'Quarantine/Isolation', absenceCategory: 'health', healthStatus: 'recovered', expectedReturn: 'Tomorrow', location: 'London', desk: null, role: 'Operations Controller', criticality: 'standard', schedule: { Mon: 'absent', Tue: 'absent', Wed: 'office', Thu: 'office', Fri: 'wfh' } },
    { id: 3, name: 'Theo James', status: 'available', initials: 'TJ', daysAbsent: null, location: 'London', desk: 'L-B4', role: 'Client Advisor', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'office', Thu: 'wfh', Fri: 'office' } },
    { id: 4, name: 'Jason Statham', status: 'available', initials: 'JS', daysAbsent: null, location: 'London', desk: 'L-D4', role: 'Desk Support', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'wfh', Tue: 'office', Wed: 'office', Thu: 'office', Fri: 'leave' } },
    { id: 5, name: 'Emma Watson', status: 'available', initials: 'EW', daysAbsent: null, location: 'London', desk: 'L-A6', role: 'Continuity Deputy', criticality: 'critical', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'wfh', Thu: 'office', Fri: 'office' } },
    { id: 6, name: 'Simone', status: 'available', initials: 'S', daysAbsent: null, isEmployee: true, location: 'London', desk: 'L-C3', role: 'Client Services', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'wfh', Thu: 'office', Fri: 'office' } },
    { id: 7, name: 'Alex James', status: 'available', initials: 'AJ', daysAbsent: null, location: 'London', desk: 'L-D5', role: 'Control Analyst', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'office', Thu: 'office', Fri: 'wfh' } },
    { id: 8, name: 'Maya Patel', status: 'available', initials: 'MP', daysAbsent: null, location: 'New York', desk: 'NY-12', role: 'Risk Analyst', criticality: 'critical', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'wfh', Wed: 'office', Thu: 'office', Fri: 'office' } },
    { id: 9, name: 'Noah Brooks', status: 'available', initials: 'NB', daysAbsent: null, location: 'New York', desk: 'NY-14', role: 'Client Services', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'office', Thu: 'wfh', Fri: 'office' } },
    { id: 10, name: 'Lina Chen', status: 'available', initials: 'LC', daysAbsent: null, location: 'New York', desk: 'NY-17', role: 'Operations Cover', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'wfh', Tue: 'office', Wed: 'office', Thu: 'office', Fri: 'office' } },
    { id: 11, name: 'Oscar Reed', status: 'wfh', initials: 'OR', daysAbsent: null, location: 'New York', desk: null, role: 'Reporting Analyst', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'wfh', Wed: 'wfh', Thu: 'office', Fri: 'office' } },
    { id: 12, name: 'Nadia King', status: 'available', initials: 'NK', daysAbsent: null, location: 'New York', desk: 'NY-21', role: 'Control Testing', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'office', Thu: 'office', Fri: 'leave' } },
    { id: 13, name: 'Ethan Cole', status: 'available', initials: 'EC', daysAbsent: null, location: 'New York', desk: 'NY-23', role: 'Desk Support', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'wfh', Thu: 'office', Fri: 'office' } },
    { id: 14, name: 'Aisha Rahman', status: 'available', initials: 'AR', daysAbsent: null, location: 'Dubai', desk: 'DXB-4', role: 'Regional Coordinator', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'office', Thu: 'wfh', Fri: 'office' } },
    { id: 15, name: 'Karim Hassan', status: 'available', initials: 'KH', daysAbsent: null, location: 'Dubai', desk: 'DXB-6', role: 'Client Services', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'wfh', Thu: 'office', Fri: 'office' } },
    { id: 16, name: 'Sofia Martin', status: 'absent', initials: 'SM', daysAbsent: 2, reason: 'Dependent Illness', absenceCategory: 'disruption', healthStatus: 'healthy', expectedReturn: 'Thu', location: 'Dubai', desk: null, role: 'Operations Analyst', criticality: 'standard', schedule: { Mon: 'office', Tue: 'absent', Wed: 'absent', Thu: 'office', Fri: 'office' } },
    { id: 17, name: 'Omar Aziz', status: 'available', initials: 'OA', daysAbsent: null, location: 'Dubai', desk: 'DXB-8', role: 'Regulated Advisor', criticality: 'essential', healthStatus: 'healthy', schedule: { Mon: 'wfh', Tue: 'office', Wed: 'office', Thu: 'office', Fri: 'office' } },
    { id: 18, name: 'Priya Shah', status: 'wfh', initials: 'PS', daysAbsent: null, location: 'Dubai', desk: null, role: 'Risk Analyst', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'wfh', Wed: 'office', Thu: 'office', Fri: 'wfh' } },
    { id: 19, name: 'Daniel Wright', status: 'available', initials: 'DW', daysAbsent: null, location: 'Dubai', desk: 'DXB-11', role: 'Control Testing', criticality: 'standard', healthStatus: 'healthy', schedule: { Mon: 'office', Tue: 'office', Wed: 'office', Thu: 'leave', Fri: 'office' } },
  ],
  minimumStaffing: {
    overall: 14,
    essential: 2,
    critical: 2,
  },
  scenarioPlanning: [
    { label: 'Today', additionalAbsences: 0 },
    { label: '+1 illness', additionalAbsences: 1 },
    { label: '+2 illness', additionalAbsences: 2 },
    { label: '+3 illness', additionalAbsences: 3 },
  ],
  absencePct: 23,
  totalTeam: 19,
  absentToday: 4,
  comparisonData: [
    { team: 'Our Team', value: 23 },
    { team: 'Team B', value: 15 },
    { team: 'Team C', value: 30 },
  ],
  criticalStaff: [
    { id: 1, name: 'Georgia Knight', status: 'available', initials: 'GK', role: 'FCA Sign-off Lead', criticality: 'essential' },
    { id: 17, name: 'Omar Aziz', status: 'available', initials: 'OA', role: 'Regulated Advisor', criticality: 'essential' },
    { id: 8, name: 'Maya Patel', status: 'available', initials: 'MP', role: 'Risk Analyst', criticality: 'critical' },
    { id: 5, name: 'Emma Watson', status: 'available', initials: 'EW', role: 'Continuity Deputy', criticality: 'critical' },
  ],
  sites: [
    { name: 'London', coords: [-0.1276, 51.5074], status: 'partial' },
    { name: 'New York', coords: [-74.006, 40.7128], status: 'open' },
    { name: 'Dubai', coords: [55.2708, 25.2048], status: 'open' },
  ],
  wfhVsAbsentTrend: [
    { label: 'Wk -3', wfh: 1, absent: 3 },
    { label: 'Wk -2', wfh: 2, absent: 3 },
    { label: 'Wk -1', wfh: 2, absent: 2 },
    { label: 'This Wk', wfh: 0, absent: 2 },
  ],
  siteAvailability: {
    'London':    { available: 6, total: 7, pct: 86 },
    'New York':  { available: 6, total: 6, pct: 100 },
    'Dubai':     { available: 5, total: 6, pct: 83 },
  },
};

export const EMPLOYEE_DATA = {
  announcements: [
    { id: 1, type: 'alert',   icon: '🏢', text: 'London HQ is at reduced capacity today — please check with your team lead before coming in.' },
    { id: 2, type: 'warning', icon: '⚠️', text: 'Team absence is above threshold today. Ensure your status is up to date.' },
    { id: 3, type: 'info',    icon: '👤', text: 'Theo James has reported absent today (Sickness).' },
    { id: 4, type: 'info',    icon: '👤', text: 'Emma Watson has reported absent today (Dependent Illness).' },
    { id: 5, type: 'info',    icon: '📋', text: 'Reminder: all WFH days must be logged before 9am.' },
    { id: 6, type: 'success', icon: '✓',  text: 'Staffing situation in Operations has been resolved.' },
  ],
  myAbsences: [
    { date: '14/04/2026', duration: 13, reason: 'Sickness' },
    { date: '11/03/2026', duration: 4,  reason: 'Other' },
    { date: '08/02/2026', duration: 3,  reason: 'Covid' },
    { date: '03/01/2026', duration: 17, reason: 'Sickness' },
  ],
  myTeam: [
    { id: 1, name: 'Georgia Knight', status: 'available', initials: 'GK' },
    { id: 2, name: 'Jason Statham', status: 'absent', initials: 'JS' },
    { id: 3, name: 'Andrew Garfield', status: 'absent', initials: 'AG' },
    { id: 4, name: 'Adela Manon', status: 'available', initials: 'AM' },
  ],
  escalationContacts: [
    { id: 1, name: 'Ellie Fanning', role: 'MD', phone: '+44 07584 999231', email: 'e.fanning@mycompany.com', initials: 'EF' },
    { id: 2, name: 'Emma Watson', role: 'ED', phone: '+44 07884 999231', email: 'e.watson@mycompany.com', initials: 'EW' },
    { id: 3, name: 'Adela Manon', role: 'ED', phone: '+44 07584 999232', email: 'a.manon@mycompany.com', initials: 'AM' },
    { id: 4, name: 'Theo James', role: 'VP', phone: '+44 07584 999235', email: 't.james@mycompany.com', initials: 'TJ' },
    { id: 5, name: 'Jason Statham', role: 'VP', phone: '+44 07084 999231', email: 'j.statham@mycompany.com', initials: 'JS' },
    { id: 6, name: 'Georgia Knight', role: 'VP', phone: '+44 07584 999236', email: 'g.knight@mycompany.com', initials: 'GK' },
  ],
  absenceReasons: DISRUPTION_CONFIG.absenceReasons.map(r => r.label),
  absenceReasonsDetailed: DISRUPTION_CONFIG.absenceReasons,
  absenceDurations: ['1 Day', '2 Days', '3 Days', '4 Days', '5+ Days'],
  deskBooking: {
    site: 'London HQ',
    floor: '3rd Floor',
    section: 'Team Bay A',
    myDeskId: 'C3',
    rows: [
      { id: 'A', desks: [
        { id: 'A1', status: 'occupied', name: 'Georgia K.' },
        { id: 'A2', status: 'available' },
        { id: 'A3', status: 'occupied', name: 'Unknown' },
        { id: 'A4', status: 'wfh',      name: 'Andrew G.' },
        { id: 'A5', status: 'available' },
        { id: 'A6', status: 'occupied', name: 'Emma W.' },
        { id: 'A7', status: 'available' },
        { id: 'A8', status: 'occupied', name: 'Unknown' },
      ]},
      { id: 'B', desks: [
        { id: 'B1', status: 'available' },
        { id: 'B2', status: 'occupied', name: 'Unknown' },
        { id: 'B3', status: 'wfh',      name: 'Unknown' },
        { id: 'B4', status: 'occupied', name: 'Theo J.' },
        { id: 'B5', status: 'available' },
        { id: 'B6', status: 'available' },
        { id: 'B7', status: 'occupied', name: 'Unknown' },
        { id: 'B8', status: 'available' },
      ]},
      { id: 'aisle', type: 'aisle' },
      { id: 'C', desks: [
        { id: 'C1', status: 'occupied', name: 'Unknown' },
        { id: 'C2', status: 'available' },
        { id: 'C3', status: 'mine',     name: 'You (Simone)' },
        { id: 'C4', status: 'available' },
        { id: 'C5', status: 'occupied', name: 'Adela M.' },
        { id: 'C6', status: 'available' },
        { id: 'C7', status: 'wfh',      name: 'Unknown' },
        { id: 'C8', status: 'occupied', name: 'Unknown' },
      ]},
      { id: 'D', desks: [
        { id: 'D1', status: 'available' },
        { id: 'D2', status: 'occupied', name: 'Unknown' },
        { id: 'D3', status: 'available' },
        { id: 'D4', status: 'occupied', name: 'Alex J.' },
        { id: 'D5', status: 'available' },
        { id: 'D6', status: 'occupied', name: 'Unknown' },
        { id: 'D7', status: 'available' },
        { id: 'D8', status: 'available' },
      ]},
    ],
  },
  monthlyAbsence: [
    { month: 'Jan', days: 17 }, { month: 'Feb', days: 3 },
    { month: 'Mar', days: 4 },  { month: 'Apr', days: 13 },
    { month: 'May', days: 0 },  { month: 'Jun', days: 0 },
    { month: 'Jul', days: 0 },  { month: 'Aug', days: 0 },
    { month: 'Sep', days: 0 },  { month: 'Oct', days: 0 },
    { month: 'Nov', days: 0 },  { month: 'Dec', days: 0 },
  ],
};

export const AVATAR_COLORS = [
  '#7c3aed', '#db2777', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#2563eb', '#7c3aed',
];

export function avatarColor(str) {
  const hash = [...str].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export const SITE_STATUS_COLORS = {
  open: '#10b981',
  partial: '#f59e0b',
  reduced: '#6366f1',
  closed: '#ef4444',
};
