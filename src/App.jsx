import { useState, useCallback } from 'react';
import Header from './components/Header';
import HRDashboard from './components/HRDashboard';
import TeamLeadDashboard from './components/TeamLeadDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Toast from './components/Toast';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import { AccessibilityProvider } from './AccessibilityContext';
import { USERS, EMPLOYEE_DATA } from './data';

// State is lifted to App so that actions by one role (e.g. an employee reporting
// absence) are immediately visible in other roles' dashboards without a data fetch.
export default function App() {
  const [currentUser, setCurrentUser] = useState('hr');
  const [toast, setToast] = useState(null);

  const [employeeAbsences, setEmployeeAbsences] = useState(EMPLOYEE_DATA.myAbsences);
  const [employeeAbsent, setEmployeeAbsent] = useState(false);
  const [employeeWFH, setEmployeeWFH] = useState(false);

  const [notificationsByUser, setNotificationsByUser] = useState({
    hr: [],
    teamlead: [],
    employee: [],
  });
  const [escalations, setEscalations] = useState([]);

  // Announcements pushed by HR that appear in Employee's feed
  const [staffAnnouncements, setStaffAnnouncements] = useState([]);

  // Shows a brief feedback message after user actions; auto-dismisses after 4s.
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Routes a notification to a specific role's inbox, enabling cross-role alerts
  // (e.g. absence submission automatically notifying the team lead).
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

  // Creates a formal escalation from the team lead to HR, visible in the HR
  // dashboard until resolved.
  const createEscalation = useCallback(({ targetName, notes, absencePct }) => {
    const escalation = {
      id: Date.now(),
      targetName,
      notes,
      absencePct,
      status: 'open',
      raisedBy: 'Melissa',
      createdAt: new Date(),
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

  // Marks an escalation as resolved and notifies the team lead of the outcome.
  const resolveEscalation = useCallback((id) => {
    setEscalations(prev => prev.map(e => (
      e.id === id ? { ...e, status: 'resolved', resolvedAt: new Date() } : e
    )));
    addNotification('teamlead', 'HR resolved your escalation', 'success');
  }, [addNotification]);

  // Lets HR broadcast an announcement that appears in every employee's feed.
  const pushStaffAnnouncement = useCallback((text, type = 'info', icon = '📢') => {
    setStaffAnnouncements(prev => [
      { id: Date.now(), type, icon, text },
      ...prev,
    ]);
  }, []);

  // Records the employee's absence and notifies the team lead in real time.
  const handleAbsenceSubmit = useCallback(({ reason, duration, date }) => {
    setEmployeeAbsences(prev => [{ date, duration, reason }, ...prev]);
    setEmployeeAbsent(true);
    setEmployeeWFH(false);
    addNotification('teamlead', `Simone reported absent (${reason})`, 'warning');
  }, [addNotification]);

  // Removes an absence record and notifies the team lead that it was withdrawn.
  const handleCancelAbsence = useCallback((index) => {
    setEmployeeAbsences(prev => prev.filter((_, i) => i !== index));
    if (index === 0) setEmployeeAbsent(false);
    addNotification('teamlead', 'Simone cancelled an absence report', 'info');
  }, [addNotification]);

  // Logs the employee as working from home and updates the team lead's view.
  const handleWFHSubmit = useCallback(() => {
    setEmployeeWFH(true);
    setEmployeeAbsent(false);
    addNotification('teamlead', 'Simone is working from home today', 'info');
  }, [addNotification]);

  const user = USERS[currentUser];

  return (
    // Provider wraps the entire app so all dashboards and the toolbar share one accessibility state.
    <AccessibilityProvider>
    <div style={{ minHeight: '100vh' }}>
      <Header
        user={user}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        notifications={notificationsByUser[currentUser] || []}
        markNotificationsRead={markNotificationsRead}
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
      {/* Floating accessibility toolbar — rendered outside main so it stays
          fixed regardless of which dashboard tab or role is active */}
      <AccessibilityToolbar />
    </div>
    </AccessibilityProvider>
  );
}
