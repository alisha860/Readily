import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import HRDashboard from './components/HRDashboard';
import TeamLeadDashboard from './components/TeamLeadDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Toast from './components/Toast';
import { USERS, EMPLOYEE_DATA } from './data';
import { THEMES, ROLE_DEFAULTS, getTheme } from './themes';

export default function App() {
  const [currentUser, setCurrentUser] = useState('hr');
  const [toast,       setToast]       = useState(null);
  const [userThemes,  setUserThemes]  = useState({ ...ROLE_DEFAULTS });

  const [employeeAbsences,       setEmployeeAbsences]       = useState(EMPLOYEE_DATA.myAbsences);
  const [employeeAbsent,         setEmployeeAbsent]         = useState(false);
  const [employeeWFH,            setEmployeeWFH]            = useState(false);
  const [employeeExpectedReturn, setEmployeeExpectedReturn] = useState(null);

  const [notificationsByUser, setNotificationsByUser] = useState({ hr: [], teamlead: [], employee: [] });
  const [escalations,         setEscalations]         = useState([]);
  const [staffAnnouncements,  setStaffAnnouncements]  = useState([]);

  // Apply theme to the document whenever the user or their chosen theme changes
  useEffect(() => {
    const t  = getTheme(userThemes[currentUser]);
    const el = document.documentElement;
    el.style.setProperty('--accent',     t.accent);
    el.style.setProperty('--accent-a04', `rgba(${t.accentRgb},0.04)`);
    el.style.setProperty('--accent-a06', `rgba(${t.accentRgb},0.06)`);
    el.style.setProperty('--accent-a08', `rgba(${t.accentRgb},0.08)`);
    el.style.setProperty('--accent-a10', `rgba(${t.accentRgb},0.10)`);
    el.style.setProperty('--accent-a12', `rgba(${t.accentRgb},0.12)`);
    el.style.setProperty('--accent-a20', `rgba(${t.accentRgb},0.20)`);
    document.body.style.background = t.gradient;
  }, [currentUser, userThemes]);

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

  const handleAbsenceSubmit = useCallback(({ reason, duration, date }) => {
    setEmployeeAbsences(prev => [{ date, duration, reason }, ...prev]);
    setEmployeeAbsent(true);
    setEmployeeWFH(false);
    const m1 = duration.match(/^(\d+) day/);
    const m2 = duration.match(/^(\d+) week/);
    const days = m1 ? +m1[1] : m2 ? +m2[1] * 7 : null;
    if (days) {
      const d = new Date(); d.setDate(d.getDate() + days);
      setEmployeeExpectedReturn(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }));
    }
    addNotification('teamlead', `Simone reported absent (${reason})`, 'warning');
  }, [addNotification]);

  const handleCancelAbsence = useCallback((index) => {
    setEmployeeAbsences(prev => prev.filter((_, i) => i !== index));
    if (index === 0) { setEmployeeAbsent(false); setEmployeeExpectedReturn(null); }
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
