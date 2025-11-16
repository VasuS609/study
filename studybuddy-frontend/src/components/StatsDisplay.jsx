import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsDisplay = ({ userStats }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
        📊 Your Learning Journey
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl p-6 border border-indigo-500/30">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-bold mb-1 text-white">{userStats.totalQuestions}</div>
          <div className="text-gray-400 text-sm">Questions Asked</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-3xl font-bold mb-1 text-white">{userStats.totalQuizzes}</div>
          <div className="text-gray-400 text-sm">Quizzes Completed</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold mb-1 text-white">{userStats.completedTasks}</div>
          <div className="text-gray-400 text-sm">Tasks Completed</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
          <div className="text-4xl mb-2">⏱️</div>
          <div className="text-3xl font-bold mb-1 text-white">{userStats.studyMinutes}</div>
          <div className="text-gray-400 text-sm">Study Minutes</div>
        </div>
      </div>

      {userStats.topics && userStats.topics.length > 0 && (
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
          <h3 className="text-xl font-bold mb-4 text-white">📚 Topics You've Explored</h3>
          <div className="flex flex-wrap gap-2">
            {userStats.topics.map((topic, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-indigo-500/20 rounded-full text-sm border border-indigo-500/30 text-white"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {userStats.totalQuestions === 0 && userStats.totalQuizzes === 0 && (
        <div className="text-center py-16">
          <TrendingUp size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400 text-lg">Start your learning journey to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;