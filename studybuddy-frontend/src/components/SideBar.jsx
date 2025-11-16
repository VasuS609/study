import React from 'react';
import StudyTimer from './StudyTimer';
import ScheduleManager from './ScheduleManager';

const Sidebar = ({ isOpen, onTimeComplete }) => {
  return (
    <aside className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-96 border-r border-slate-700 bg-slate-800/30 backdrop-blur-sm overflow-hidden flex-shrink-0`}>
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        <StudyTimer onTimeComplete={onTimeComplete} />
        <ScheduleManager />
      </div>
    </aside>
  );
};

export default Sidebar;