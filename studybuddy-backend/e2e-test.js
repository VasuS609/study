const axios = require('axios');

async function run() {
  const base = 'http://localhost:5000/api';
  try {
    console.log('Calling /api/health...');
    const h = await axios.get(`${base}/health`);
    console.log('health:', h.data);
  } catch (err) {
    console.error('Health error:', err.message || err.toString());
  }

  try {
    console.log('\nCalling /api/chat...');
    const chat = await axios.post(`${base}/chat`, { question: 'Explain recursion in simple terms', userId: 'e2e_test' }, { timeout: 60000 });
    console.log('chat response:', chat.data);
  } catch (err) {
    console.error('Chat error:', err.response ? err.response.data : err.message);
  }

  try {
    console.log('\nCalling /api/quiz...');
    const quiz = await axios.post(`${base}/quiz`, { topic: 'Photosynthesis', numQuestions: 3, userId: 'e2e_test' }, { timeout: 60000 });
    console.log('quiz response:', quiz.data);
  } catch (err) {
    console.error('Quiz error:', err.response ? err.response.data : err.message);
  }
}

run().catch(e => {
  console.error('E2E test failed:', e);
  process.exit(1);
});