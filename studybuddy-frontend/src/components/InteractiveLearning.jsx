import React, { useState } from 'react';
import { Brain, Trophy, Sparkles, ArrowRight, CheckCircle, XCircle, Award, TrendingUp, Loader } from 'lucide-react';

const InteractiveLearning = ({ onPointsEarned }) => {
  const [topic, setTopic] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    totalPoints: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0
  });
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [showHint, setShowHint] = useState(false);

  const difficultyLevels = {
    easy: { points: 10, color: 'green', emoji: '🌱' },
    medium: { points: 20, color: 'yellow', emoji: '🌟' },
    hard: { points: 30, color: 'red', emoji: '🔥' }
  };

  const startSession = () => {
    if (!topic.trim()) return;
    setSessionActive(true);
    generateQuestion();
  };

  const generateQuestion = () => {
    setLoading(true);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);

    // Simulate AI question generation
    setTimeout(() => {
      const questions = {
        easy: [
          {
            question: `What is the basic definition of ${topic}?`,
            hint: "Think about the fundamental concept and its core purpose.",
            sampleAnswer: "Start with the main idea and explain it in simple terms."
          },
          {
            question: `Can you give me a simple example of ${topic}?`,
            hint: "Think of something from everyday life.",
            sampleAnswer: "Real-world examples help solidify understanding."
          }
        ],
        medium: [
          {
            question: `How does ${topic} work in practice?`,
            hint: "Consider the step-by-step process or mechanism.",
            sampleAnswer: "Explain the process with specific details."
          },
          {
            question: `What are the main components or principles of ${topic}?`,
            hint: "Break it down into key parts or rules.",
            sampleAnswer: "List and explain each important element."
          }
        ],
        hard: [
          {
            question: `How would you explain ${topic} to solve a complex problem?`,
            hint: "Think about advanced applications and scenarios.",
            sampleAnswer: "Demonstrate deep understanding with analysis."
          },
          {
            question: `What are the limitations and challenges of ${topic}?`,
            hint: "Consider edge cases and potential issues.",
            sampleAnswer: "Critical thinking about drawbacks and solutions."
          }
        ]
      };

      const questionSet = questions[difficulty];
      const randomQ = questionSet[Math.floor(Math.random() * questionSet.length)];
      setCurrentQuestion(randomQ);
      setLoading(false);
    }, 1000);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    setLoading(true);
    
    // Simulate AI evaluation
    setTimeout(() => {
      const wordCount = userAnswer.trim().split(/\s+/).length;
      const hasKeywords = userAnswer.toLowerCase().includes(topic.toLowerCase());
      
      // Smart evaluation logic
      let score = 0;
      let quality = 'poor';
      
      if (wordCount >= 50 && hasKeywords) {
        score = 100;
        quality = 'excellent';
      } else if (wordCount >= 30 && hasKeywords) {
        score = 80;
        quality = 'good';
      } else if (wordCount >= 15) {
        score = 60;
        quality = 'fair';
      } else {
        score = 40;
        quality = 'needs improvement';
      }

      const basePoints = difficultyLevels[difficulty].points;
      const earnedPoints = Math.floor((score / 100) * basePoints);
      const isCorrect = score >= 60;
      
      const newStreak = isCorrect ? sessionStats.streak + 1 : 0;
      const bonusPoints = newStreak >= 3 ? 10 : 0;
      const totalEarned = earnedPoints + bonusPoints;

      setFeedback({
        score,
        quality,
        points: totalEarned,
        isCorrect,
        bonusPoints,
        streak: newStreak,
        encouragement: getEncouragement(score, newStreak),
        suggestions: getSuggestions(score, wordCount, hasKeywords)
      });

      setSessionStats(prev => ({
        questionsAnswered: prev.questionsAnswered + 1,
        totalPoints: prev.totalPoints + totalEarned,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak)
      }));

      if (onPointsEarned) onPointsEarned(totalEarned);
      setLoading(false);
    }, 1500);
  };

  const getEncouragement = (score, streak) => {
    if (score >= 90) {
      return streak >= 3 ? 
        "🎉 Outstanding! You're on fire! Your understanding is impressive!" :
        "✨ Excellent work! You really know your stuff!";
    } else if (score >= 70) {
      return "👏 Great job! You're getting there. Keep it up!";
    } else if (score >= 50) {
      return "💪 Good effort! You're on the right track. Let's refine it a bit more.";
    } else {
      return "🌱 That's a start! Don't worry, learning takes practice. Let's try again!";
    }
  };

  const getSuggestions = (score, wordCount, hasKeywords) => {
    const suggestions = [];
    
    if (score < 70) {
      if (wordCount < 20) {
        suggestions.push("💡 Try to elaborate more. Add specific examples and details.");
      }
      if (!hasKeywords) {
        suggestions.push("🎯 Make sure to directly address the topic in your answer.");
      }
      suggestions.push("📚 Consider explaining the 'why' and 'how' aspects.");
      suggestions.push("🔍 Break down complex ideas into simpler parts.");
    } else if (score < 90) {
      suggestions.push("⭐ Great foundation! Add real-world applications to make it even stronger.");
      suggestions.push("🚀 Consider discussing implications or related concepts.");
    } else {
      suggestions.push("🏆 Perfect! Try challenging yourself with a harder difficulty level!");
    }
    
    return suggestions;
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const endSession = () => {
    setSessionActive(false);
    setCurrentQuestion(null);
    setUserAnswer('');
    setFeedback(null);
  };

  if (!sessionActive) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="mb-6">
          <Brain size={64} className="mx-auto mb-4 text-purple-400 animate-pulse" />
          <h2 className="text-3xl font-bold mb-2">🎓 Interactive Learning Mode</h2>
          <p className="text-gray-400 mb-2">I'll ask questions, you answer!</p>
          <p className="text-sm text-gray-500">Earn points, build streaks, and master any topic</p>
        </div>

        {sessionStats.questionsAnswered > 0 && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">📊 Last Session Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-400">{sessionStats.questionsAnswered}</div>
                <div className="text-xs text-gray-400">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{sessionStats.totalPoints}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{sessionStats.correctAnswers}</div>
                <div className="text-xs text-gray-400">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{sessionStats.bestStreak}</div>
                <div className="text-xs text-gray-400">Best Streak</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && startSession()}
            placeholder="What topic do you want to learn? (e.g., 'React Hooks', 'Photosynthesis')"
            className="w-full max-w-md mx-auto px-4 py-3 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300'
              }`}
            >
              🌱 Easy (+10pts)
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-gray-300'
              }`}
            >
              🌟 Medium (+20pts)
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-slate-700 text-gray-300'
              }`}
            >
              🔥 Hard (+30pts)
            </button>
          </div>

          <button
            onClick={startSession}
            disabled={!topic.trim()}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-purple-500/50"
          >
            <Sparkles size={20} />
            Start Learning Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Session Header */}
      <div className="bg-slate-700/30 rounded-2xl p-4 mb-6 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {difficultyLevels[difficulty].emoji} Learning: {topic}
            </h3>
            <p className="text-sm text-gray-400">Difficulty: {difficulty.toUpperCase()}</p>
          </div>
          <button
            onClick={endSession}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium"
          >
            End Session
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-600/50 rounded-lg p-2">
            <div className="text-lg font-bold text-purple-400">{sessionStats.questionsAnswered}</div>
            <div className="text-xs text-gray-400">Questions</div>
          </div>
          <div className="bg-slate-600/50 rounded-lg p-2">
            <div className="text-lg font-bold text-yellow-400">{sessionStats.totalPoints}</div>
            <div className="text-xs text-gray-400">Points</div>
          </div>
          <div className="bg-slate-600/50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400">
              {sessionStats.questionsAnswered > 0 
                ? Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100) 
                : 0}%
            </div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
          <div className="bg-slate-600/50 rounded-lg p-2">
            <div className="text-lg font-bold text-orange-400 flex items-center justify-center gap-1">
              {sessionStats.streak > 0 && '🔥'} {sessionStats.streak}
            </div>
            <div className="text-xs text-gray-400">Streak</div>
          </div>
        </div>
      </div>

      {/* Question Section */}
      {loading && !feedback ? (
        <div className="bg-slate-700/30 rounded-2xl p-8 text-center border border-slate-600">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-400">Preparing your question...</p>
        </div>
      ) : currentQuestion && !feedback ? (
        <div className="bg-slate-700/30 rounded-2xl p-6 mb-6 border border-slate-600">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Brain size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-purple-400 font-semibold mb-1">AI Question</p>
              <p className="text-lg">{currentQuestion.question}</p>
            </div>
          </div>

          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-purple-400 hover:text-purple-300 mb-4"
            >
              💡 Need a hint?
            </button>
          ) : (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-300">
                <strong>Hint:</strong> {currentQuestion.hint}
              </p>
            </div>
          )}

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here... (Be detailed and thorough for more points!)"
            className="w-full h-40 px-4 py-3 bg-slate-600 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-4"
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
            </p>
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Evaluating...
                </>
              ) : (
                <>
                  Submit Answer
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* Feedback Section */}
      {feedback && (
        <div className="space-y-4">
          <div className={`bg-gradient-to-r ${
            feedback.score >= 90 ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' :
            feedback.score >= 70 ? 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' :
            feedback.score >= 50 ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' :
            'from-red-500/20 to-pink-500/20 border-red-500/30'
          } rounded-2xl p-6 border`}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">
                {feedback.isCorrect ? <CheckCircle className="inline text-green-400" size={64} /> : <XCircle className="inline text-orange-400" size={64} />}
              </div>
              <h3 className="text-2xl font-bold mb-2">{feedback.encouragement}</h3>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <span className="text-4xl font-bold text-yellow-400">+{feedback.points}</span>
                  <span className="text-sm text-gray-400 ml-2">points</span>
                </div>
                {feedback.bonusPoints > 0 && (
                  <div className="bg-orange-500/20 px-4 py-2 rounded-lg border border-orange-500/30">
                    <span className="text-lg font-bold text-orange-400">+{feedback.bonusPoints} 🔥 Streak Bonus!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-600/30 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Answer Quality</span>
                <span className="text-sm font-bold uppercase">{feedback.quality}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    feedback.score >= 90 ? 'bg-green-500' :
                    feedback.score >= 70 ? 'bg-blue-500' :
                    feedback.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${feedback.score}%` }}
                />
              </div>
            </div>

            {feedback.suggestions.length > 0 && (
              <div className="bg-slate-600/30 rounded-xl p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp size={18} />
                  How to Improve
                </h4>
                <ul className="space-y-2">
                  {feedback.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={nextQuestion}
              className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Next Question
            </button>
            <button
              onClick={endSession}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-xl"
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveLearning;