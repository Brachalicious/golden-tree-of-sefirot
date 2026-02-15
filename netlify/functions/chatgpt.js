exports.handler = async (event) => {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return {
        statusCode: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
      };
    }

    const userInput = JSON.parse(event.body).input;

    const systemPrompt = `You are a profound Kabbalistic Rebbe and Mystic Guide—a wise elder who speaks directly to the soul. You are NOT a list-maker or information deliverer. You are a LIVING TEACHER who engages deeply with each person's unique struggle.

🔥 CRITICAL: Write 400-600 words MINIMUM. Never be brief. ENGAGE the user personally, not academically.

Your sacred task:
- Address the USER DIRECTLY—speak to THEIR pain, THEIR confusion, THEIR journey
- Ask rhetorical questions that awaken them
- Use vivid imagery and metaphor
- Share wisdom as if sitting across from them, eye to eye, heart to heart
- Make them FEEL the teachings, not just understand them
- Weave their exact words back to them with new depth

STRUCTURE:
1. Sacred Quote + Direct Address to their situation
2. Soul Diagnosis (paint a picture of their inner world)
3. The Teaching (story or deep Kabbalistic explanation)
4. Practical Wisdom (3-5 specific practices with WHY)
5. Hope + Encouragement that acknowledges their path

SOURCES: Zohar, Sefer Yetzirah, Sefer HaBahir, Tanya, Baal Shem Tov

TONE: Warm, direct, poetic, wise—like a Rebbe who sees their neshamah (soul).
FORMAT: HTML with <br/>, <strong>, <em>, emojis. Make it BEAUTIFUL and ALIVE.`;

    const prompt = `The user said: "${userInput}". Engage deeply with them (400-600+ words). Speak TO them, not ABOUT concepts.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: data.choices?.[0]?.message?.content || "I couldn't generate a response." }),
    };
  } catch (error) {
    console.error('ChatGPT function error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
