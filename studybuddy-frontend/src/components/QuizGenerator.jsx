import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader } from 'lucide-react';

const QuizGenerator = ({ onQuizComplete }) => {
  const [quizTopic, setQuizTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    if (!quizTopic.trim()) return;
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});

    setTimeout(() => {
      const questions = [
        { 
          question: `What is the fundamental principle of ${quizTopic}?`, 
          options: ['Option A', 'Option B', 'Option C', 'Option D'], 
          correct: 0, 
          explanation: 'This is the correct answer because it represents the core foundation of the concept.'
        },
        { 
          question: `How does ${quizTopic} apply in real-world scenarios?`, 
          options: ['Application 1', 'Application 2', 'Application 3', 'Application 4'], 
          correct: 1, 
          explanation: 'This demonstrates practical usage in everyday situations.'
        },
        { 
          question: `What is a common misconception about ${quizTopic}?`, 
          options: ['Misconception A', 'Misconception B', 'Misconception C', 'Misconception D'], 
          correct: 2, 
          explanation: 'Understanding this helps avoid common errors in application.'
        },
        { 
          question: `Which technique works best for ${quizTopic}?`, 
          options: ['Technique 1', 'Technique 2', 'Technique 3', 'Technique 4'], 
          correct: 1, 
          explanation: 'This approach is most effective because of its systematic nature.'
        },
        { 
          question: `What are the key components of ${quizTopic}?`, 
          options: ['Components A', 'Components B', 'Components C', 'Components D'], 
          correct: 3, 
          explanation: 'These components work together to form the complete system.'
        }
      ];
      setQuiz(questions);
      if (onQuizComplete) onQuizComplete(quizTopic);
      setLoading(false);
    }, 1500);
  };

  const handleAnswerSelect = (qIdx, aIdx) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const submitQuiz = () => setShowResults(true);

  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.reduce((acc, q, idx) => acc + (selectedAnswers[idx] === q.correct ? 1 : 0), 0);
  };

  const resetQuiz = () => {
    setQuiz(null);
    setQuizTopic('');
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <BookOpen size={64} className="mx-auto mb-4 text-indigo-400" />
        <h2 className="text-2xl font-bold mb-2">Generate Practice Quiz</h2>
        <p className="text-gray-400 mb-6">Test your knowledge on any topic</p>
        <input 
          type="text" 
          value={quizTopic} 
          onChange={(e) => setQuizTopic(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && generateQuiz()}
          placeholder="Enter topic (e.g., 'React Hooks', 'Photosynthesis')"
          className="w-full max-w-md mx-auto px-4 py-3 bg-slate-700 rounded-xl mb-4 border-0 focus:ring-2 focus:ring-indigo-500 outline-none" 
        />
        <button 
          onClick={generateQuiz} 
          disabled={loading || !quizTopic.trim()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl font-medium flex items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Quiz
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">📝 {quizTopic}</h2>
          <p className="text-gray-400 text-sm">{quiz.length} questions</p>
        </div>
        <button 
          onClick={resetQuiz}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
        >
          New Quiz
        </button>
      </div>

      {showResults && (
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 mb-6 text-center border border-indigo-500/30">
          <div className="text-5xl mb-3">
            {calculateScore() === quiz.length ? '🎉' : calculateScore() >= quiz.length * 0.7 ? '✨' : '💪'}
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <div className="text-4xl font-bold mb-2">
            <span className="text-indigo-400">{calculateScore()}</span>
            <span className="text-gray-400 text-2xl"> / {quiz.length}</span>
          </div>
          <p className="text-xl text-indigo-400 mb-2">
            {Math.round((calculateScore() / quiz.length) * 100)}% Correct
          </p>
          <p className="text-gray-400">
            {calculateScore() === quiz.length 
              ? "Perfect score! You're crushing it! 🌟"
              : calculateScore() >= quiz.length * 0.7
              ? "Great job! Keep it up! 💫"
              : "Good effort! Review and try again! 📚"}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {quiz.map((q, qIdx) => (
          <div key={qIdx} className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
            <p className="text-lg font-medium mb-4">
              <strong className="text-indigo-400">Q{qIdx + 1}:</strong> {q.question}
            </p>
            
            <div className="space-y-2 mb-4">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[qIdx] === optIdx;
                const isCorrect = optIdx === q.correct;
                const showCorrect = showResults && isCorrect;
                const showWrong = showResults && isSelected && !isCorrect;
                
                return (
                  <button 
                    key={optIdx} 
                    onClick={() => handleAnswerSelect(qIdx, optIdx)}
                    disabled={showResults}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showCorrect ? 'bg-green-500/20 border-green-500' :
                      showWrong ? 'bg-red-500/20 border-red-500' :
                      isSelected ? 'bg-indigo-500/20 border-indigo-500' :
                      'bg-slate-600/30 border-slate-600 hover:bg-slate-600/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold flex-shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {showCorrect && <span className="text-green-400 text-xl">✓</span>}
                      {showWrong && <span className="text-red-400 text-xl">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {showResults && q.explanation && (
              <div className="bg-slate-600/30 rounded-xl p-4 border border-slate-500">
                <strong className="text-indigo-400">💡 Explanation:</strong>
                <p className="mt-1 text-gray-300">{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showResults && Object.keys(selectedAnswers).length > 0 && (
        <button 
          onClick={submitQuiz}
          className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg"
        >
          Submit Quiz ({Object.keys(selectedAnswers).length}/{quiz.length})
        </button>
      )}
    </div>
  );
};

export default QuizGenerator;