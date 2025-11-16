import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Settings, X } from 'lucide-react';

const StudyTimer = ({ onTimeComplete }) => {
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('study');
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const [tempStudy, setTempStudy] = useState(25);
  const [tempBreak, setTempBreak] = useState(5);
  const [tempLongBreak, setTempLongBreak] = useState(15);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Zenora Timer', {
        body: mode === 'study' ? '🎉 Study session complete! Time for a break.' : '🚀 Break over! Ready to study?',
        icon: '/logo.png'
      });
    }

    if (mode === 'study') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      
      if (onTimeComplete) {
        onTimeComplete(studyDuration);
      }

      if (newSessions % 4 === 0) {
        setTimeLeft(longBreakDuration * 60);
      } else {
        setTimeLeft(breakDuration * 60);
      }
      setMode('break');
    } else {
      setTimeLeft(studyDuration * 60);
      setMode('study');
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, studyDuration, breakDuration, longBreakDuration, sessions]);

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? studyDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? studyDuration * 60 : breakDuration * 60);
  };

  const openSettings = () => {
    setTempStudy(studyDuration);
    setTempBreak(breakDuration);
    setTempLongBreak(longBreakDuration);
    setShowSettings(true);
  };

  const saveSettings = () => {
    setStudyDuration(tempStudy);
    setBreakDuration(tempBreak);
    setLongBreakDuration(tempLongBreak);
    
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? tempStudy * 60 : tempBreak * 60);
    setShowSettings(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDuration = () => {
    return mode === 'study' ? studyDuration * 60 : breakDuration * 60;
  };

  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="text-indigo-600" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Study Timer</h3>
        </div>
        <button
          onClick={openSettings}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isRunning}
        >
          <Settings className={isRunning ? 'text-gray-300' : 'text-gray-600'} size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode('study')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            mode === 'study'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Study
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            mode === 'break'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Break
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <svg className="transform -rotate-90" width="200" height="200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="100" cy="100" r="90" fill="none"
            stroke={mode === 'study' ? '#4f46e5' : '#10b981'}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</div>
          <div className="text-sm text-gray-500 mt-1">
            {mode === 'study' ? 'Focus Time' : 'Break Time'}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full shadow-lg transition-all hover:scale-105 ${
            mode === 'study' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all hover:scale-105"
        >
          <RotateCcw size={28} />
        </button>
      </div>

      <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-500 mb-1">Sessions</div>
          <div className="text-2xl font-bold text-gray-800">{sessions}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-500 mb-1">Study Time</div>
          <div className="text-2xl font-bold text-gray-800">{sessions * studyDuration} min</div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Timer Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Duration (minutes)
                </label>
                <input
                  type="number" min="1" max="120" value={tempStudy}
                  onChange={(e) => setTempStudy(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  {[15, 25, 45, 60].map(min => (
                    <button
                      key={min} onClick={() => setTempStudy(min)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-indigo-100 text-gray-700 rounded-md transition-colors"
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number" min="1" max="30" value={tempBreak}
                  onChange={(e) => setTempBreak(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  {[3, 5, 10, 15].map(min => (
                    <button
                      key={min} onClick={() => setTempBreak(min)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-green-100 text-gray-700 rounded-md transition-colors"
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number" min="1" max="60" value={tempLongBreak}
                  onChange={(e) => setTempLongBreak(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  {[10, 15, 20, 30].map(min => (
                    <button
                      key={min} onClick={() => setTempLongBreak(min)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-green-100 text-gray-700 rounded-md transition-colors"
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;