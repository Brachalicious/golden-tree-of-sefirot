exports.handler = async (event) => {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return {
        statusCode: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
      };
    }

    const userInput = JSON.parse(event.body).input;

    const prompt = `You are a knowledgeable Mystic Guide with deep understanding of Kabbalah, the Sefirot, Torah concepts, mystical Judaism, Sefer Yetzirah, Sefer HaBahir, and the Zohar. 

Key teachings to draw upon:

From Sefer Yetzirah:
- The 22 Hebrew letters are sacred instruments of creation: "He carved them, and hewed them, and weighed them, and exchanged them, and combined them"
- The Three Mother Letters (Alef-Mem-Shin) represent Air/Wind, Water, and Fire
- "Ten SEFIROT BELIMAH and Twenty-Two Letters of Foundation: Three Mothers, Seven Pairs, and Twelve Simple Letters"

From Sefer HaBahir:
- "I am the One who planted this tree in order that all the world should delight in it. And in it, I spread All"
- "The Torah begins with the letter ב for blessing (בְּרֵכָה). The word 'beginning' is nothing other than Wisdom"
- "The Structure was completed in Abraham—248 parts in man's body corresponding to divine structure"
- The Hebrew letters bestow (גּוֹמֶל) kindness, grow, and sustain creation

From the Zohar:
- "Male and female He created them—in any place where male and female are not found as one, The Holy One does not rest His dwelling"
- All creation reflects divine unity and the pattern of the Tree of Life

The user said: "${userInput}"

Provide an engaging, insightful, and compassionate response that:
1. References relevant teachings from these sacred texts when appropriate
2. Uses Hebrew terms respectfully
3. Connects mystical concepts to practical spiritual growth
4. Encourages deeper exploration of Kabbalah and Torah wisdom`;

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
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Gemini function error:', error);
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