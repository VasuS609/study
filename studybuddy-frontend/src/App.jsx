import React, { useState} from 'react';
import AppHeader from './components/AppHeader';
import Sidebar from './components/SideBar';
import ModeSelector from './components/ModeSelector';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import StatsDisplay from './components/StatsDisplay';
import InteractiveLearning from './components/InteractiveLearning'; // ADD THIS
import EmotionalSupport from './components/EmotionalSupport'; // ADD THIS
import { useUserStats } from './hooks/useUserStats';
import { useClock } from './hooks/useClock';

function App() {
  const [mode, setMode] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentTime = useClock();
  const { userStats, updateStats } = useUserStats();

  const handleQuestionAsked = () => {
    updateStats({ totalQuestions: userStats.totalQuestions + 1 });
  };

  const handleQuizComplete = (topic) => {
    updateStats({
      totalQuizzes: userStats.totalQuizzes + 1,
      topics: userStats.topics.includes(topic) ? userStats.topics : [...userStats.topics, topic]
    });
  };

  const handleTimeComplete = (minutes) => {
    updateStats({ studyMinutes: userStats.studyMinutes + minutes });
  };

  const handlePointsEarned = (points) => { // ADD THIS
    console.log('Points earned:', points);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      <AppHeader 
        currentTime={currentTime}
        userStats={userStats}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar 
          isOpen={sidebarOpen}
          onTimeComplete={handleTimeComplete}
        />

        <main className={`${sidebarOpen ? 'hidden' : 'flex'} lg:flex flex-1 flex-col overflow-hidden min-w-0`}>
          <div className="p-4">
            <ModeSelector mode={mode} setMode={setMode} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {mode === 'chat' && (
              <ChatInterface onQuestionAsked={handleQuestionAsked} />
            )}

            {mode === 'interactive' && ( // ADD THIS
              <InteractiveLearning onPointsEarned={handlePointsEarned} />
            )}

            {mode === 'quiz' && (
              <QuizGenerator onQuizComplete={handleQuizComplete} />
            )}

            {mode === 'support' && ( // ADD THIS
              <EmotionalSupport />
            )}

            {mode === 'stats' && (
              <StatsDisplay userStats={userStats} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;