const fetch = require('node-fetch');

exports.handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const userInput = JSON.parse(event.body).input;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userInput }] }]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};