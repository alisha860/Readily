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

export const HR_DATA = {
  staffStatus: {
    available: 80,
    inOffice: 142,
    wfh: 88,
    absent: 38,
    onLeave: 22,
    total: 290,
  },
  riskRecommendations: [
    {
      id: 1,
      dept: 'Compliance',
      level: 'Critical',
      text: 'Ensure minimum FCA staffing. Immediate identity backup required.',
      color: '#dc2626',
      bg: '#fff1f2',
    },
    {
      id: 2,
      dept: 'Wealth Mgmt',
      level: 'Warning',
      text: 'Single-occupation specialist evaluation. Identify backup personnel.',
      color: '#d97706',
      bg: '#fffbeb',
    },
    {
      id: 3,
      dept: 'Operations',
      level: 'Warning',
      text: 'Appointment review required. Assign temporary role coverage.',
      color: '#d97706',
      bg: '#fffbeb',
    },
    {
      id: 4,
      dept: 'Technology',
      level: 'Monitor',
      text: 'Monitor specialist capacity. Continue 30-day trend analysis.',
      color: '#2563eb',
      bg: '#eff6ff',
    },
  ],
  orgAbsenceSnapshot: [
    { dept: 'Compliance', inOffice: 45, absent: 35, wfh: 15, onLeave: 5 },
    { dept: 'Operations', inOffice: 72, absent: 8, wfh: 14, onLeave: 6 },
    { dept: 'Wealth Mgmt', inOffice: 60, absent: 20, wfh: 16, onLeave: 4 },
    { dept: 'Technology', inOffice: 82, absent: 5, wfh: 10, onLeave: 3 },
    { dept: 'Risk', inOffice: 55, absent: 28, wfh: 12, onLeave: 5 },
    { dept: 'HR', inOffice: 68, absent: 12, wfh: 14, onLeave: 6 },
  ],
  interventions: [
    {
      id: 1,
      level: 'Critical',
      title: 'Activate Compliance Cover',
      text: 'FCA-approved persons below minimum. Deploy policy: activate first-line reserve.',
      color: '#dc2626',
      bg: '#fff1f2',
      dot: '#dc2626',
    },
    {
      id: 2,
      level: 'Warning',
      title: 'Review Operations Staffing',
      text: '5 days. The level: temporary staff covering. Review for tech apps.',
      color: '#d97706',
      bg: '#fffbeb',
      dot: '#d97706',
    },
    {
      id: 3,
      level: 'Warning',
      title: 'Update Remote Working Policy',
      text: 'WFH rates exceeding 40% in Wealth Mgmt. Revise hybrid attendance.',
      color: '#d97706',
      bg: '#fffbeb',
      dot: '#d97706',
    },
    {
      id: 4,
      level: 'Stable',
      title: 'Technology Team Stable',
      text: '30-day trend: consistent. Continue monitoring at current levels.',
      color: '#059669',
      bg: '#f0fdf4',
      dot: '#059669',
    },
  ],
  highRiskDepts: [
    { name: 'Risk', pct: 87, status: 'Stable', color: '#10b981' },
    { name: 'Technology', pct: 94, status: 'Stable', color: '#10b981' },
    { name: 'Wealth Mgmt', pct: 81, status: 'Stable', color: '#10b981' },
    { name: 'Operations', pct: 67, status: 'Warning', color: '#f59e0b' },
    { name: 'Compliance', pct: 83, status: 'Critical', color: '#ef4444' },
  ],
  absenceTrend: [
    { day: 'Mon', value: 8 },
    { day: 'Tue', value: 10 },
    { day: 'Wed', value: 12 },
    { day: 'Thu', value: 14 },
    { day: 'Fri', value: 16 },
    { day: 'Sat', value: 18 },
    { day: 'Sun', value: 20 },
  ],
  sites: [
    { name: 'London', coords: [-0.1276, 51.5074], status: 'partial' },
    { name: 'New York', coords: [-74.006, 40.7128], status: 'open' },
    { name: 'Dubai', coords: [55.2708, 25.2048], status: 'open' },
    { name: 'Mumbai', coords: [72.8777, 19.076], status: 'reduced' },
    { name: 'Hong Kong', coords: [114.1694, 22.3193], status: 'reduced' },
    { name: 'Tokyo', coords: [139.6917, 35.6895], status: 'open' },
    { name: 'Sydney', coords: [151.2093, -33.8688], status: 'open' },
  ],
};

export const TEAM_LEAD_DATA = {
  team: [
    { id: 1, name: 'Georgia Knight', status: 'available', initials: 'GK', daysAbsent: null },
    { id: 2, name: 'Adela Manon', status: 'absent', initials: 'AM', daysAbsent: 14 },
    { id: 3, name: 'Theo James', status: 'available', initials: 'TJ', daysAbsent: null },
    { id: 4, name: 'Jason Statham', status: 'available', initials: 'JS', daysAbsent: null },
    { id: 5, name: 'Andrew Garfield', status: 'absent', initials: 'AG', daysAbsent: 3 },
    { id: 6, name: 'Emma Watson', status: 'available', initials: 'EW', daysAbsent: null },
    { id: 7, name: 'Alex James', status: 'available', initials: 'AJ', daysAbsent: null },
  ],
  absencePct: 23,
  totalTeam: 17,
  absentToday: 4,
  comparisonData: [
    { team: 'Our Team', value: 23 },
    { team: 'Team B', value: 15 },
    { team: 'Team C', value: 30 },
  ],
  criticalStaff: [
    { id: 1, name: 'Theo James', status: 'available', initials: 'TJ' },
    { id: 2, name: 'Alex James', status: 'available', initials: 'AJ' },
    { id: 3, name: 'Georgia Knight', status: 'available', initials: 'GK' },
    { id: 4, name: 'Emma Watson', status: 'available', initials: 'EW' },
  ],
  sites: [
    { name: 'London', coords: [-0.1276, 51.5074], status: 'partial' },
    { name: 'New York', coords: [-74.006, 40.7128], status: 'open' },
    { name: 'Dubai', coords: [55.2708, 25.2048], status: 'open' },
    { name: 'Mumbai', coords: [72.8777, 19.076], status: 'reduced' },
    { name: 'Hong Kong', coords: [114.1694, 22.3193], status: 'reduced' },
    { name: 'Tokyo', coords: [139.6917, 35.6895], status: 'open' },
    { name: 'Sydney', coords: [151.2093, -33.8688], status: 'open' },
  ],
};

export const EMPLOYEE_DATA = {
  announcements: [
    { id: 1, type: 'alert', icon: '🏢', text: 'CQ-HQ — Your site is closed.' },
    { id: 2, type: 'info', icon: '👤', text: 'Alisha Ahmad is absent.' },
    { id: 3, type: 'warning', icon: '⚠️', text: 'Absence levels exceeded threshold.' },
    { id: 4, type: 'success', icon: '✓', text: 'Your absence request was submitted.' },
    { id: 5, type: 'info', icon: '👤', text: 'Eugenia Agbukor is absent.' },
    { id: 6, type: 'info', icon: '👤', text: 'Srivani Pittala is absent.' },
  ],
  myAbsences: [
    { date: '12/02/2025', duration: 13, reason: 'Sickness' },
    { date: '02/01/2025', duration: 17, reason: 'Covid' },
    { date: '21/11/2024', duration: 3, reason: 'Other' },
    { date: '17/06/2024', duration: 4, reason: 'Sickness' },
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
  absenceReasons: ['Sickness', 'Covid', 'Personal Leave', 'Annual Leave', 'Other'],
  absenceDurations: ['1 Day', '2 Days', '3 Days', '4 Days', '5+ Days'],
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
