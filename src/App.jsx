// App: root component that owns all cross-role state (absences, escalations, notifications, announcements)
import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import HRDashboard from './components/hr/HRDashboard';
import TeamLeadDashboard from './components/teamLead/TeamLeadDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import Toast from './components/Toast';
import { USERS, EMPLOYEE_DATA } from './data';
import { THEMES, ROLE_DEFAULTS, getTheme } from './themes';

export default function App() {
  const [currentUser, setCurrentUser] = useState('hr');
  const [toast, setToast] = useState(null);
  const [userThemes, setUserThemes] = useState({ ...ROLE_DEFAULTS });

  const [employeeAbsences, setEmployeeAbsences] = useState(EMPLOYEE_DATA.myAbsences);
  const [employeeAbsent, setEmployeeAbsent] = useState(false);
  const [employeeWFH, setEmployeeWFH] = useState(false);
  const [employeeExpectedReturn, setEmployeeExpectedReturn] = useState(null);
  const [employeeHandover, setEmployeeHandover] = useState('');

  // Escalations and announcements live here rather than inside individual dashboards because
  // they are cross-role: when Melissa raises an escalation, Alex (HR) must see it immediately,
  // and when Alex sends an announcement, Simone's (Employee) feed must update. Lifting this
  // state to App is the simplest way to share it without a global state library.
  const [notificationsByUser, setNotificationsByUser] = useState({ hr: [], teamlead: [], employee: [] });
  const [escalations, setEscalations] = useState([]);
  const [staffAnnouncements, setStaffAnnouncements] = useState([]);

  // Apply theme CSS variables whenever the active user or their chosen theme changes.
  // CSS custom properties are used so every component in the tree picks up the new accent
  // colour without needing to receive it as a prop.
  useEffect(() => {
    const t = getTheme(userThemes[currentUser]);
    const el = document.documentElement;
    el.style.setProperty('--accent', t.accent);
    el.style.setProperty('--accent-a04', `rgba(${t.accentRgb},0.04)`);
    el.style.setProperty('--accent-a06', `rgba(${t.accentRgb},0.06)`);
    el.style.setProperty('--accent-a08', `rgba(${t.accentRgb},0.08)`);
    el.style.setProperty('--accent-a10', `rgba(${t.accentRgb},0.10)`);
    el.style.setProperty('--accent-a12', `rgba(${t.accentRgb},0.12)`);
    el.style.setProperty('--accent-a20', `rgba(${t.accentRgb},0.20)`);
    document.body.style.background = t.gradient;
  }, [currentUser, userThemes]);

  // useCallback is used on all handlers so their references stay stable across re-renders.
  // Without it, passing them as props would cause child dashboards to re-render on every
  // toast state change or unrelated state update; useCallback prevents that.
  const setUserTheme = useCallback((themeId) => {
    setUserThemes(prev => ({ ...prev, [currentUser]: themeId }));
  }, [currentUser]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const addNotification = useCallback((recipient, message, type = 'info') => {
    setNotificationsByUser(prev => ({
      ...prev,
      [recipient]: [
        { id: Date.now() + Math.random(), message, type, time: new Date(), read: false },
        // Cap at 10 notifications per user so the bell panel doesn't grow indefinitely.
        ...(prev[recipient] || []).slice(0, 9),
      ],
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotificationsByUser(prev => ({
      ...prev,
      [currentUser]: (prev[currentUser] || []).map(n => ({ ...n, read: true })),
    }));
  }, [currentUser]);

  const createEscalation = useCallback(({ targetName, notes, absencePct }) => {
    const escalation = {
      id: Date.now(), targetName, notes, absencePct,
      status: 'open', raisedBy: 'Melissa', createdAt: new Date(),
    };
    setEscalations(prev => [escalation, ...prev]);
    addNotification(
      'hr',
      targetName
        ? `Melissa escalated ${targetName}'s absence`
        : `Melissa escalated team absence at ${absencePct}%`,
      'warning'
    );
    return escalation;
  }, [addNotification]);

  const resolveEscalation = useCallback((id) => {
    setEscalations(prev => prev.map(e => (
      e.id === id ? { ...e, status: 'resolved', resolvedAt: new Date() } : e
    )));
    addNotification('teamlead', 'HR resolved your escalation', 'success');
  }, [addNotification]);

  const pushStaffAnnouncement = useCallback((text, type = 'info', icon = '📢') => {
    setStaffAnnouncements(prev => [{ id: Date.now(), type, icon, text }, ...prev]);
  }, []);

  const handleAbsenceSubmit = useCallback(({ reason, duration, date, handover }) => {
    setEmployeeAbsences(prev => [{ date, duration, reason }, ...prev]);
    setEmployeeAbsent(true);
    setEmployeeWFH(false);
    setEmployeeHandover(handover || '');
    // Parse the expected-return date from the duration string (e.g. "3 Days", "1 week")
    // so we can show it on the Team Lead dashboard without the employee having to enter a date.
    const m1 = String(duration).match(/^(\d+) day/);
    const m2 = String(duration).match(/^(\d+) week/);
    const days = m1 ? +m1[1] : m2 ? +m2[1] * 7 : typeof duration === 'number' ? duration : null;
    if (days) {
      const d = new Date(); d.setDate(d.getDate() + days);
      setEmployeeExpectedReturn(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }));
    }
    addNotification('teamlead', `Simone reported absent (${reason})`, 'warning');
  }, [addNotification]);

  const handleCancelAbsence = useCallback((index) => {
    setEmployeeAbsences(prev => prev.filter((_, i) => i !== index));
    // Only clear the live absent flag if the first (most recent) record is being withdrawn,
    // because that is the one that set employeeAbsent to true. Removing an older record
    // should not affect today's status.
    if (index === 0) { setEmployeeAbsent(false); setEmployeeExpectedReturn(null); setEmployeeHandover(''); }
    addNotification('teamlead', 'Simone cancelled an absence report', 'info');
  }, [addNotification]);

  const handleWFHSubmit = useCallback(() => {
    setEmployeeWFH(true);
    setEmployeeAbsent(false);
    addNotification('teamlead', 'Simone is working from home today', 'info');
  }, [addNotification]);

  const currentTheme = getTheme(userThemes[currentUser]);
  const user = { ...USERS[currentUser], avatarBg: currentTheme.avatarBg };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        user={user}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        notifications={notificationsByUser[currentUser] || []}
        markNotificationsRead={markNotificationsRead}
        userThemes={userThemes}
        setUserTheme={setUserTheme}
        allThemes={THEMES}
      />
      <main style={{ padding: '24px 28px', maxWidth: 1600, margin: '0 auto' }}>
        {currentUser === 'hr' && (
          <HRDashboard
            key="hr"
            user={user}
            showToast={showToast}
            employeeAbsent={employeeAbsent}
            employeeWFH={employeeWFH}
            pushStaffAnnouncement={pushStaffAnnouncement}
            addNotification={addNotification}
            escalations={escalations}
            resolveEscalation={resolveEscalation}
          />
        )}
        {currentUser === 'teamlead' && (
          <TeamLeadDashboard
            key="teamlead"
            user={user}
            showToast={showToast}
            employeeAbsent={employeeAbsent}
            employeeWFH={employeeWFH}
            employeeExpectedReturn={employeeExpectedReturn}
            employeeHandover={employeeHandover}
            addNotification={addNotification}
            createEscalation={createEscalation}
          />
        )}
        {currentUser === 'employee' && (
          <EmployeeDashboard
            key="employee"
            user={user}
            showToast={showToast}
            absences={employeeAbsences}
            onAbsenceSubmit={handleAbsenceSubmit}
            onCancelAbsence={handleCancelAbsence}
            onWFHSubmit={handleWFHSubmit}
            isAbsent={employeeAbsent}
            isWFH={employeeWFH}
            staffAnnouncements={staffAnnouncements}
          />
        )}
      </main>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
