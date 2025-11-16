import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Check, Trash2, Edit2, Sparkles, X, Clock, TrendingUp, Plus } from 'lucide-react';

const ScheduleManager = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjects, setSubjects] = useState('');
  const [newTask, setNewTask] = useState({
    task: '',
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium'
  });

  useEffect(() => {
    const saved = localStorage.getItem('schedule');
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
      } catch (e) {
        setSchedule([]);
        console.log(e)
      }
    }
  }, []);

  useEffect(() => {
    if (schedule.length >= 0) {
      localStorage.setItem('schedule', JSON.stringify(schedule));
    }
  }, [schedule]);

  const generateSchedule = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const subjectsArray = subjects.split(',').map(s => s.trim()).filter(Boolean);
      const subjectsToUse = subjectsArray.length > 0 ? subjectsArray : ['Mathematics', 'Science', 'English', 'History'];
      
      const timeSlots = [
        { start: '09:00', end: '10:30' },
        { start: '10:45', end: '12:15' },
        { start: '13:00', end: '14:30' },
        { start: '14:45', end: '16:15' },
        { start: '16:30', end: '18:00' }
      ];

      const priorities = ['high', 'medium', 'low'];
      
      const newSchedule = subjectsToUse.slice(0, 5).map((subject, index) => ({
        _id: Date.now() + index,
        task: `Study ${subject}`,
        startTime: timeSlots[index].start,
        endTime: timeSlots[index].end,
        priority: priorities[index % 3],
        completed: false
      }));

      setSchedule(newSchedule);
      setShowGenerateModal(false);
      setSubjects('');
    } catch (error) {
      alert('Failed to generate schedule. Please try again.');
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [subjects]);

  const addTask = useCallback(() => {
    if (!newTask.task.trim()) {
      alert('Please enter a task name');
      return;
    }

    const task = {
      _id: Date.now(),
      task: newTask.task.trim(),
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      priority: newTask.priority,
      completed: false
    };

    setSchedule(prev => [...prev, task]);
    setShowAddModal(false);
    setNewTask({ task: '', startTime: '09:00', endTime: '10:00', priority: 'medium' });
  }, [newTask]);

  const completeTask = useCallback((taskId) => {
    setSchedule(prev => prev.map(task => 
      task._id === taskId ? { ...task, completed: true } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId) => {
    if (!window.confirm('Delete this task?')) return;
    setSchedule(prev => prev.filter(task => task._id !== taskId));
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setSchedule(prev => prev.map(task => 
      task._id === taskId ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
  }, []);

  const stats = useMemo(() => {
    const completed = schedule.filter(t => t.completed).length;
    const total = schedule.length;
    const progressPercent = total > 0 ? (completed / total) * 100 : 0;
    
    const totalMinutes = schedule.reduce((acc, task) => {
      if (task.startTime && task.endTime) {
        const [startH, startM] = task.startTime.split(':').map(Number);
        const [endH, endM] = task.endTime.split(':').map(Number);
        const duration = (endH * 60 + endM) - (startH * 60 + startM);
        return acc + duration;
      }
      return acc;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { completed, total, progressPercent, hours, minutes };
  }, [schedule]);

  const groupedTasks = useMemo(() => {
    const groups = { high: [], medium: [], low: [] };
    schedule.forEach(task => {
      const priority = task.priority?.toLowerCase() || 'medium';
      if (groups[priority]) {
        groups[priority].push(task);
      } else {
        groups.medium.push(task);
      }
    });
    return groups;
  }, [schedule]);

  const TaskCard = ({ task }) => (
    <div className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority?.toLowerCase() || 'medium'}`}>
      <button
        onClick={() => !task.completed && completeTask(task._id)}
        className={`check-btn ${task.completed ? 'checked' : ''}`}
        disabled={task.completed}
        aria-label="Complete task"
      >
        {task.completed && <Check size={16} />}
      </button>

      <div className="task-content">
        {editingTask === task._id ? (
          <input
            type="text"
            defaultValue={task.task}
            onBlur={(e) => {
              if (e.target.value.trim()) {
                updateTask(task._id, { task: e.target.value.trim() });
              } else {
                setEditingTask(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.target.blur();
              if (e.key === 'Escape') setEditingTask(null);
            }}
            className="task-edit-input"
            autoFocus
          />
        ) : (
          <div className="task-info">
            <h4>{task.task}</h4>
            <div className="task-meta">
              {task.startTime && task.endTime && (
                <span className="task-time">
                  <Clock size={14} />
                  {task.startTime} - {task.endTime}
                </span>
              )}
              <span className={`task-priority ${task.priority?.toLowerCase() || 'medium'}`}>
                {task.priority || 'Medium'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          onClick={() => setEditingTask(task._id)}
          className="action-btn"
          disabled={task.completed}
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          className="action-btn delete"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="bg-white rounded-2xl shadow-xl p-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={24} className="text-indigo-600" />
                Today's Schedule
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddModal(true)} 
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 shadow-md text-sm"
              >
                <Plus size={16} />
                Add
              </button>
              <button 
                onClick={() => setShowGenerateModal(true)} 
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-md text-sm"
              >
                <Sparkles size={16} />
                AI
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-900">
                  {Math.round(stats.progressPercent)}%
                </div>
                <div className="text-xs text-indigo-600">Progress</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {stats.hours}h {stats.minutes}m
                </div>
                <div className="text-xs text-green-600">Study Time</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
          {schedule.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">No tasks scheduled for today</p>
              <button 
                onClick={() => setShowGenerateModal(true)} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-md text-sm"
              >
                <Sparkles size={16} />
                Generate Schedule with AI
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {groupedTasks.high.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                    🔴 High Priority
                  </h3>
                  <div className="space-y-2">
                    {groupedTasks.high.map(task => <TaskCard key={task._id} task={task} />)}
                  </div>
                </div>
              )}

              {groupedTasks.medium.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                    🟡 Medium Priority
                  </h3>
                  <div className="space-y-2">
                    {groupedTasks.medium.map(task => <TaskCard key={task._id} task={task} />)}
                  </div>
                </div>
              )}

              {groupedTasks.low.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
                    🟢 Low Priority
                  </h3>
                  <div className="space-y-2">
                    {groupedTasks.low.map(task => <TaskCard key={task._id} task={task} />)}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Plus size={24} className="text-green-600" />
                  Add New Task
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                  <input
                    type="text" value={newTask.task}
                    onChange={(e) => setNewTask(prev => ({ ...prev, task: e.target.value }))}
                    placeholder="e.g., Study Mathematics"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time" value={newTask.startTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time" value={newTask.endTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles size={24} className="text-indigo-600" />
                  Generate AI Schedule
                </h3>
                <button onClick={() => setShowGenerateModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Enter your subjects (comma-separated) or leave empty for a general schedule
              </p>
              
              <input
                type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g., Math, Physics, Chemistry, English"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-6"
                onKeyDown={(e) => e.key === 'Enter' && !loading && generateSchedule()}
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowGenerateModal(false)} 
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={generateSchedule} disabled={loading} 
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .task-card {
          @apply bg-white rounded-lg p-3 flex items-center gap-3 border-l-4 transition-all hover:shadow-md;
        }
        .task-card.priority-high { @apply border-red-500; }
        .task-card.priority-medium { @apply border-yellow-500; }
        .task-card.priority-low { @apply border-green-500; }
        .task-card.completed { @apply opacity-60 bg-gray-50; }
        .check-btn {
          @apply w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all hover:border-indigo-500 flex-shrink-0;
        }
        .check-btn.checked { @apply bg-indigo-600 border-indigo-600 text-white; }
        .task-content { @apply flex-1 min-w-0; }
        .task-info h4 { @apply font-semibold text-gray-800 mb-1 text-sm truncate; }
        .task-meta { @apply flex items-center gap-2 text-xs text-gray-500; }
        .task-time { @apply flex items-center gap-1; }
        .task-priority { @apply px-2 py-0.5 rounded-full text-xs font-medium uppercase; }
        .task-priority.high { @apply bg-red-100 text-red-700; }
        .task-priority.medium { @apply bg-yellow-100 text-yellow-700; }
        .task-priority.low { @apply bg-green-100 text-green-700; }
        .task-actions { @apply flex gap-1 flex-shrink-0; }
        .action-btn {
          @apply p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed;
        }
        .action-btn.delete { @apply hover:bg-red-50 hover:text-red-600; }
        .task-edit-input {
          @apply w-full px-2 py-1 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm;
        }
      `}</style>
    </div>
  );
};

export default ScheduleManager;