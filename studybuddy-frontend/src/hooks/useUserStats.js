import { useState, useEffect } from 'react';

const DEFAULT_STATS = {
  totalQuestions: 0,
  totalQuizzes: 0,
  completedTasks: 0,
  studyMinutes: 0,
  topics: []
};

export const useUserStats = () => {
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('zenora_stats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  useEffect(() => {
    localStorage.setItem('zenora_stats', JSON.stringify(userStats));
  }, [userStats]);

  const updateStats = (updates) => {
    setUserStats(prev => ({ ...prev, ...updates }));
  };

  const resetStats = () => {
    setUserStats(DEFAULT_STATS);
    localStorage.removeItem('zenora_stats');
  };

  return { userStats, updateStats, resetStats };
};