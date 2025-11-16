const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAvUF3yinC8r-_UiBJZA_VxfLvdJOXI28o';
console.log('Testing API key:', apiKey.slice(0, 20) + '...');

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    console.log('\n1. Listing available models...');
    if (typeof genAI.listModels === 'function') {
      const res = await genAI.listModels();
      const models = res?.models || [];
      console.log(`Found ${models.length} models:`);
      models.slice(0, 10).forEach(m => {
        console.log(`  - ${m.name}`);
      });
    } else {
      console.log('listModels not available');
    }
  } catch (err) {
    console.error('List models error:', err.message);
  }

  try {
    console.log('\n2. Testing gemini-1.5-flash directly...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello');
    console.log('Success! Response:', result.response.text().slice(0, 50));
  } catch (err) {
    console.error('gemini-1.5-flash error:', err.message);
  }

  try {
    console.log('\n3. Testing gemini-pro directly...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello');
    console.log('Success! Response:', result.response.text().slice(0, 50));
  } catch (err) {
    console.error('gemini-pro error:', err.message);
  }
}

test().catch(e => console.error('Fatal error:', e));