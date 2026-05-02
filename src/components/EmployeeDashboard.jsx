import { useState } from 'react';
import { TabBar, PageHeader } from './shared';
import { EMPLOYEE_DATA } from '../data';
import TodayTab    from './employee/TodayTab';
import MyRecordTab from './employee/MyRecordTab';

export default function EmployeeDashboard({ user, showToast, absences, onAbsenceSubmit, onCancelAbsence, onWFHSubmit, isAbsent, isWFH, staffAnnouncements = [] }) {
  const { announcements: initialAnnouncements, absenceReasons, absenceDurations } = EMPLOYEE_DATA;

  const [activeTab,   setActiveTab]   = useState('today');
  const [reportMode,  setReportMode]  = useState('absence');
  const [reason,      setReason]      = useState('');
  const [duration,    setDuration]    = useState('');
  const [handover,    setHandover]    = useState('');
  const [wfhNote,     setWfhNote]     = useState('');
  const [dismissed,   setDismissed]   = useState(new Set());
  const [localAnnouncements, setLocalAnnouncements] = useState(initialAnnouncements);

  const announcements = [...staffAnnouncements, ...localAnnouncements]
    .filter(a => !dismissed.has(a.id));

  const dismissAnnouncement = id => setDismissed(prev => new Set([...prev, id]));

  const handleSubmitAbsence = () => {
    if (!reason || !duration) { showToast('Please select a reason and duration.', 'warning'); return; }
    const today = new Date().toLocaleDateString('en-GB');
    const days  = parseInt(duration) || 1;
    onAbsenceSubmit({ reason, duration: days, date: today });
    setLocalAnnouncements(prev => [{
      id: Date.now(), type: 'warning', icon: '🏠',
      text: `You reported an absence starting today: ${reason}, estimated ${duration}.`,
    }, ...prev]);
    showToast('Absence submitted. Your manager has been notified.', 'success');
    setReason(''); setDuration(''); setHandover('');
  };

  const handleSubmitWFH = () => {
    onWFHSubmit();
    setLocalAnnouncements(prev => [{
      id: Date.now(), type: 'info', icon: '🏠',
      text: `You logged as working from home today${wfhNote ? `: ${wfhNote}` : '.'}`,
    }, ...prev]);
    showToast('WFH status logged. Your team can see you are working remotely.', 'success');
    setWfhNote('');
  };

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <PageHeader name={user.name} subtitle="Employee Dashboard" />

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'today',  label: 'Today' },
          { key: 'record', label: 'My Record' },
        ]}
      />

      {activeTab === 'today' && (
        <TodayTab
          isAbsent={isAbsent}
          isWFH={isWFH}
          announcements={announcements}
          dismissAnnouncement={dismissAnnouncement}
          reportMode={reportMode}
          setReportMode={setReportMode}
          reason={reason}
          setReason={setReason}
          duration={duration}
          setDuration={setDuration}
          handover={handover}
          setHandover={setHandover}
          wfhNote={wfhNote}
          setWfhNote={setWfhNote}
          onSubmitAbsence={handleSubmitAbsence}
          onSubmitWFH={handleSubmitWFH}
          setActiveTab={setActiveTab}
          showToast={showToast}
        />
      )}

      {activeTab === 'record' && (
        <MyRecordTab
          absences={absences}
          onCancelAbsence={onCancelAbsence}
          showToast={showToast}
          isAbsent={isAbsent}
          isWFH={isWFH}
        />
      )}
    </div>
  );
}
