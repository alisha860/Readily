import { useState, useCallback } from 'react';
import Header from './components/Header';
import HRDashboard from './components/HRDashboard';
import TeamLeadDashboard from './components/TeamLeadDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Toast from './components/Toast';
import { USERS } from './data';

export default function App() {
  const [currentUser, setCurrentUser] = useState('hr');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const user = USERS[currentUser];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header user={user} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <main style={{
        padding: '24px 28px',
        maxWidth: 1600,
        margin: '0 auto',
      }}>
        {currentUser === 'hr' && (
          <HRDashboard key="hr" user={user} showToast={showToast} />
        )}
        {currentUser === 'teamlead' && (
          <TeamLeadDashboard key="teamlead" user={user} showToast={showToast} />
        )}
        {currentUser === 'employee' && (
          <EmployeeDashboard key="employee" user={user} showToast={showToast} />
        )}
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
