const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  console.log('🔑 API Key:', process.env.GEMINI_API_KEY ? 'Found' : 'NOT FOUND');
  console.log('📝 Model:', process.env.GEMINI_MODEL || 'gemini-1.5-flash');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ No API key in environment');
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Test different models
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-pro'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🧪 Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in 3 words');
      const text = await result.response.text();
      console.log(`✅ ${modelName} works!`);
      console.log(`   Response: ${text}`);
      return; // Stop after first success
    } catch (error) {
      console.log(`❌ ${modelName} failed:`, error.message);
    }
  }
  
  console.log('\n💥 All models failed');
}

testGemini();