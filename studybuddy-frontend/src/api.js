import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
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
