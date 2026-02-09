const fetch = require('node-fetch');

exports.handler = async (event) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
    };
  }

  const userInput = JSON.parse(event.body).input;

  const prompt = `You are a knowledgeable Mystic Guide with deep understanding of Kabbalah, the Sefirot, Torah concepts, and mystical Judaism. The user said: "${userInput}". Provide an engaging, insightful, and compassionate response that encourages deeper spiritual exploration. Use relevant Hebrew terms and mystical concepts where appropriate.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();

  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};