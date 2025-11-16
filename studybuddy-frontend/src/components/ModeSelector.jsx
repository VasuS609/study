import React from 'react';
import { Send, BookOpen, TrendingUp, Brain, Heart } from 'lucide-react';

const ModeSelector = ({ mode, setMode }) => {
  const modes = [
    { id: 'chat', label: 'AI Tutor', Icon: Send },
    { id: 'interactive', label: 'Practice', Icon: Brain },
    { id: 'quiz', label: 'Quiz', Icon: BookOpen },
    { id: 'support', label: 'Wellness', Icon: Heart },
    { id: 'stats', label: 'Progress', Icon: TrendingUp }
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {modes.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setMode(id)}
          className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
            mode === id 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
          }`}
        >
          <Icon size={18} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;