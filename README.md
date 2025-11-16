# 🎓 StudyBuddy - AI-Powered Study Assistant

An intelligent study companion application that helps students learn effectively through AI-powered tutoring, quiz generation, schedule management, and progress tracking.

![StudyBuddy Banner](https://img.shields.io/badge/StudyBuddy-AI%20Learning-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

## ✨ Features

- **🤖 AI Tutor Chat**: Get instant help with any subject from an expert AI tutor powered by Google Gemini
- **📝 Quiz Generator**: Create custom quizzes on any topic with AI-generated questions
- **📅 Smart Scheduling**: AI-generated personalized study schedules
- **📊 Progress Tracking**: Monitor your study time, tasks completed, and learning progress
- **⏱️ Study Timer**: Track focused study sessions with Pomodoro-style timer
- **🎯 Stats Dashboard**: View your learning statistics and achievements

## 🏗️ Project Structure

\`\`\`
studybuddy/
├── studybuddy-frontend/     # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── api.js          # API configuration
│   ├── .env                # Frontend environment variables
│   └── package.json
├── studybuddy-backend/      # Node.js + Express backend
│   ├── server.js           # Main server file
│   ├── .env                # Backend environment variables (create from .env.example)
│   ├── .env.example        # Example environment configuration
│   └── package.json
└── package.json            # Root package for running both
\`\`\`

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB** - Either:
  - Local installation ([Download](https://www.mongodb.com/try/download/community))
  - MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Gemini API Key** ([Get your free key](https://ai.google.dev/))

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd study
   \`\`\`

2. **Install all dependencies**
   \`\`\`bash
   npm install
   cd studybuddy-frontend && npm install
   cd ../studybuddy-backend && npm install
   cd ..
   \`\`\`

3. **Configure Backend Environment**
   
   Create \`.env\` file in \`studybuddy-backend/\`:
   \`\`\`bash
   cd studybuddy-backend
   cp .env.example .env
   \`\`\`
   
   Edit \`studybuddy-backend/.env\` with your credentials:
   \`\`\`env
   # Get your API key from https://ai.google.dev/
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   
   # Use local MongoDB or your Atlas connection string
   MONGODB_URI=mongodb://localhost:27017/studybuddy
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studybuddy
   
   # Backend server port
   PORT=5001
   \`\`\`

4. **Configure Frontend Environment**
   
   Create \`.env\` file in \`studybuddy-frontend/\`:
   \`\`\`bash
   cd studybuddy-frontend
   echo 'VITE_API_URL=http://localhost:5001/api' > .env
   cd ..
   \`\`\`

5. **Run the Application**
   \`\`\`bash
   npm run dev
   \`\`\`

   This starts:
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:5001

## 🎮 Usage

1. Open your browser to http://localhost:5173
2. Start asking questions in the AI Tutor tab
3. Generate quizzes on any topic
4. Track your progress in the Stats tab
5. Use the Study Timer in the sidebar

## 🔧 Technology Stack

### Frontend
- **React 19** - Modern UI library
- **Vite 7** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database
- **Google Generative AI** - AI capabilities (Gemini)
- **CORS** - Cross-origin resource sharing

## 📡 API Endpoints

### Health & Connection
- \`GET /api/health\` - Server health check
- \`GET /api/data\` - Connection test

### AI Features
- \`POST /api/chat\` - Chat with AI tutor
- \`POST /api/quiz\` - Generate quiz questions
- \`GET /api/history/:userId\` - Get chat history

### Schedule Management
- \`POST /api/schedule/generate\` - Generate AI study schedule
- \`GET /api/schedule/:userId\` - Get user schedule
- \`PUT /api/schedule/:id\` - Update task
- \`POST /api/schedule/:id/complete\` - Mark task complete
- \`DELETE /api/schedule/:id\` - Delete task

### Progress & Stats
- \`GET /api/stats/:userId\` - Get user statistics
- \`GET /api/progress/:userId\` - Get progress data
- \`POST /api/progress/time\` - Update study time

## 🛠️ Development

### Run Frontend Only
\`\`\`bash
cd studybuddy-frontend
npm run dev
\`\`\`

### Run Backend Only
\`\`\`bash
cd studybuddy-backend
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
cd studybuddy-frontend
npm run build
\`\`\`

## 🐛 Troubleshooting

### Port 5001 Already in Use
\`\`\`bash
# macOS/Linux
lsof -ti:5001 | xargs kill -9

# Or change PORT in studybuddy-backend/.env
\`\`\`

### MongoDB Connection Issues
- **Local MongoDB**: Ensure MongoDB is running (\`mongod\`)
- **MongoDB Atlas**: 
  - Verify your connection string
  - Check IP whitelist (allow 0.0.0.0/0 for development)
  - Ensure user has proper permissions

### Gemini API Issues
- Verify your API key is correct
- Check you haven't exceeded free tier limits (15 requests/min)
- Try waiting 60 seconds if you hit rate limits
- Monitor usage at: https://ai.dev/usage

### Frontend Can't Connect to Backend
- Verify backend is running on port 5001
- Check \`VITE_API_URL\` in frontend \`.env\` matches backend port
- Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

## 📝 Environment Variables

### Backend (\`studybuddy-backend/.env\`)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| \`GEMINI_API_KEY\` | Google Gemini API key | Yes | \`AIzaSy...\` |
| \`GEMINI_MODEL\` | Model to use | No | \`gemini-2.5-flash\` |
| \`MONGODB_URI\` | MongoDB connection string | Yes | \`mongodb://localhost:27017/studybuddy\` |
| \`PORT\` | Server port | No | \`5001\` |

### Frontend (\`studybuddy-frontend/.env\`)
| Variable | Description | Example |
|----------|-------------|---------|
| \`VITE_API_URL\` | Backend API URL | \`http://localhost:5001/api\` |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Google Generative AI](https://ai.google.dev/) for AI capabilities
- [MongoDB](https://www.mongodb.com/) for database
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [TailwindCSS](https://tailwindcss.com/) for styling utilities
- [Vite](https://vitejs.dev/) for blazing fast development

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [Troubleshooting](#-troubleshooting) section above

---

Made with ❤️ by the StudyBuddy Team
