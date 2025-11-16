import axios from "axios";

// Use environment variable for API URL, fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat
export const askChatbot = (question) =>
  API.post("/chat", { question, userId: "guest" });

// Quiz
export const generateQuiz = (topic) =>
  API.post("/quiz", { topic, numQuestions: 5, userId: "guest" });

// Explain concept
export const explainConcept = (concept) =>
  API.post("/explain", { concept });

// History
export const getHistory = () =>
  API.get("/history/guest");

// Stats
export const getStats = () =>
  API.get("/stats/guest");

export default API;
