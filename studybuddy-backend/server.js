const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// ---------------- CORS FIX ----------------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://aizenora.vercel.app",
    "https://zenoraai.vercel.app",     // ADD THIS
    "https://zenora-1.onrender.com"    // ADD THIS
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Important: handle preflight
app.use(cors());

// ------------------------------------------

app.use(express.json());

// Initialize Gemini AI (graceful fallback)
let model = null;
let selectedModelName = null;

function createFallbackModel() {
  return {
    async generateContent(prompt) {
      const lower = (prompt || '').toLowerCase();

      if (
        lower.includes('multiple choice') ||
        lower.includes('format as json') ||
        lower.includes('json array')
      ) {
        const sample = [
          {
            question: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            correct: 3,
            explanation: '2 + 2 equals 4.'
          }
        ];
        return { response: { text: () => Promise.resolve(JSON.stringify(sample)) } };
      }

      if (
        lower.includes('study schedule') ||
        lower.includes('personalized daily study schedule')
      ) {
        const sampleSchedule = [
          {
            task: 'Study Math - Algebra',
            startTime: '09:00',
            endTime: '10:00',
            category: 'study',
            priority: 'high'
          },
          { task: 'Break', startTime: '10:00', endTime: '10:15', category: 'break', priority: 'low' }
        ];
        return { response: { text: () => Promise.resolve(JSON.stringify(sampleSchedule)) } };
      }

      return {
        response: {
          text: () =>
            Promise.resolve(
              'Sorry, the AI service is not configured. This is a fallback response.'
            )
        }
      };
    }
  };
}

async function selectModel() {
  if (!process.env.GEMINI_API_KEY) {
    model = createFallbackModel();
    selectedModelName = 'fallback-mock';
    console.log('⚠️ No GEMINI_API_KEY found — using fallback model');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const preferred = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const testModel = genAI.getGenerativeModel({ model: preferred });

    try {
      await testModel.generateContent('Hi');
      model = testModel;
      selectedModelName = preferred;
      console.log('✅ Gemini model ready:', preferred);
      return;
    } catch (e) {
      console.warn('⚠️ Gemini test call failed — falling back to mock model');
    }
  } catch (err) {
    console.warn('⚠️ Failed to initialize GoogleGenerativeAI:', err && err.message);
  }

  model = createFallbackModel();
  selectedModelName = 'fallback-mock';
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studybuddy')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Schemas
const chatSchema = new mongoose.Schema({
  userId: String,
  question: String,
  answer: String,
  topic: String,
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  userId: String,
  totalQuestions: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: Date,
  topics: [String],
  studyMinutes: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 }
});

const scheduleSchema = new mongoose.Schema({
  userId: String,
  task: String,
  startTime: String,
  endTime: String,
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  category: String,
  priority: { type: String, default: 'medium' }
});

const progressSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  studyMinutes: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  questionsAsked: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 }
});

const Chat = mongoose.model('Chat', chatSchema);
const User = mongoose.model('User', userSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const Progress = mongoose.model('Progress', progressSchema);

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1500;

async function rateLimitedRequest(requestFn) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  return await requestFn();
}

// ==================== API ROUTES ====================

// Simple health check for deployment tests
app.get("/api/data", (req, res) => {
  res.json({ msg: "Connected successfully!" });
});

// ---------------- Chat Route ----------------
app.post('/api/chat', async (req, res) => {
  try {
    const { question, userId = 'guest' } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const prompt = `You are an expert tutor...

Student Question: ${question}

Provide a scannable, easy-to-understand answer.`;

    const answer = await rateLimitedRequest(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });

    await Chat.create({ userId, question, answer, topic: 'general' });

    await User.findOneAndUpdate(
      { userId },
      {
        $inc: { totalQuestions: 1 },
        $set: { lastActive: new Date() }
      },
      { upsert: true }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Progress.findOneAndUpdate(
      { userId, date: { $gte: today } },
      { $inc: { questionsAsked: 1 } },
      { upsert: true }
    );

    res.json({ success: true, answer });
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get response. Please try again.'
    });
  }
});

// ---------------- QUIZ Route ----------------
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, numQuestions = 5, userId = 'guest' } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    const prompt = `Generate ${numQuestions} multiple choice questions...`;

    const text = await rateLimitedRequest(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const quiz = JSON.parse(cleanText);

    await User.findOneAndUpdate(
      { userId },
      {
        $inc: { totalQuizzes: 1 },
        $addToSet: { topics: topic },
        $set: { lastActive: new Date() }
      },
      { upsert: true }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Progress.findOneAndUpdate(
      { userId, date: { $gte: today } },
      { $inc: { quizzesTaken: 1 } },
      { upsert: true }
    );

    res.json({ success: true, quiz, topic });
  } catch (error) {
    console.error('❌ Quiz error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz.'
    });
  }
});

// ------------ Explain Concept ----------------
app.post('/api/explain', async (req, res) => {
  try {
    const { concept } = req.body;

    if (!concept) return res.status(400).json({ success: false, error: 'Concept is required' });

    const prompt = `Explain "${concept}" in detail...`;

    const explanation = await rateLimitedRequest(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });

    res.json({ success: true, explanation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate explanation.' });
  }
});

// ------------- Generate AI Schedule -----------
app.post('/api/schedule/generate', async (req, res) => {
  try {
    const { userId = 'guest', preferences = {}, subjects = [] } = req.body;

    const prompt = `Create a personalized study schedule...`;

    const text = await rateLimitedRequest(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const scheduleData = JSON.parse(cleanText);

    const savedSchedules = await Schedule.insertMany(
      scheduleData.map(item => ({ ...item, userId }))
    );

    res.json({ success: true, schedule: savedSchedules });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate schedule.' });
  }
});

// -------- Get Schedule --------
app.get('/api/schedule/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedule = await Schedule.find({
      userId,
      date: { $gte: today }
    }).sort({ startTime: 1 });

    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
  }
});

// -------- Update Schedule --------
app.put('/api/schedule/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Schedule.findByIdAndUpdate(id, req.body, { new: true });

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

// Complete Task
app.post('/api/schedule/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const task = await Schedule.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );

    await User.findOneAndUpdate(
      { userId },
      { $inc: { completedTasks: 1 } },
      { upsert: true }
    );

    // Progress update
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Progress.findOneAndUpdate(
      { userId, date: { $gte: today } },
      { $inc: { tasksCompleted: 1 } },
      { upsert: true }
    );

    const prompt = `Generate ONE short motivation quote...`;

    const quote = await rateLimitedRequest(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    });

    res.json({ success: true, task, quote });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete task' });
  }
});

// Delete Schedule
app.delete('/api/schedule/:id', async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
});

// Fetch Progress
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const days = parseInt(req.query.days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const progressData = await Progress.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    res.json({ success: true, progress: progressData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

// Update Study Time
app.post('/api/progress/time', async (req, res) => {
  try {
    const { userId, minutes } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Progress.findOneAndUpdate(
      { userId, date: { $gte: today } },
      { $inc: { studyMinutes: minutes } },
      { upsert: true }
    );

    await User.findOneAndUpdate(
      { userId },
      { $inc: { studyMinutes: minutes } },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update time' });
  }
});

// Fetch Stats
app.get('/api/stats/:userId', async (req, res) => {
  try {
    let user = await User.findOne({ userId });

    if (!user) {
      user = {
        userId,
        totalQuestions: 0,
        totalQuizzes: 0,
        streak: 0,
        topics: [],
        studyMinutes: 0,
        completedTasks: 0
      };
    }

    res.json({ success: true, stats: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// Fetch Chat History
app.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const chats = await Chat.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, chats, count: chats.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// ---------------- HEALTH CHECK ----------------
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Zenora API is running!',
    model: selectedModelName,
    timestamp: new Date().toISOString()
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

selectModel().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Zenora Backend running on port ${PORT}`);
    console.log(`🤖 Using model: ${selectedModelName}`);
  });
});
