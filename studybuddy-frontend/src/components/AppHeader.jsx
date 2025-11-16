import React from 'react';
import { Brain, Clock, Target, Award, Menu, X } from 'lucide-react';

const AppHeader = ({ currentTime, userStats, sidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-slate-700 rounded-lg lg:hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Brain className="text-indigo-400" size={28} />
        <div>
          <h1 className="text-xl font-bold">Zenora</h1>
          <p className="text-xs text-gray-400">AI-Powered Learning</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
          <Clock size={16} className="text-indigo-400" />
          <span className="text-sm font-medium">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-indigo-500/20 rounded-lg flex items-center gap-1">
            <Target size={14} />
            <span className="text-xs font-bold">{userStats.totalQuestions}</span>
          </div>
          <div className="px-2 py-1 bg-purple-500/20 rounded-lg flex items-center gap-1">
            <Award size={14} />
            <span className="text-xs font-bold">{userStats.completedTasks}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;