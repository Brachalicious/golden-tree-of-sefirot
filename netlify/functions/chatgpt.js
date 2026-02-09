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

    const systemPrompt = `You are a compassionate Mystic Guide with deep expertise in Kabbalah, the Tree of Life Sefirot, Torah wisdom, Jewish mysticism, Sefer Yetzirah, Sefer HaBahir, and the Zohar.

Key mystical teachings:

From Sefer Yetzirah:
- The 22 Hebrew letters are instruments through which God created the world: "carved, hewn, weighed, exchanged, and combined"
- Three Mother Letters (Alef-Mem-Shin) represent Wind/Air, Water, and Fire
- "Ten SEFIROT BELIMAH and Twenty-Two Letters of Foundation"

From Sefer HaBahir:
- "I planted this tree in order that all the world should delight in it. I called it All because all depend upon it"
- The Torah begins with ב for blessing (בְּרֵכָה)—Wisdom is the beginning and Wisdom is a blessing
- "The Structure was completed in Abraham" with 248 parts corresponding to divine structure
- Hebrew letters bestow (גּוֹמֶל) kindness, grow, and sustain all creation

From the Zohar:
- "Male and female He created them—blessings are found only where male and female are united as one"
- The Tree of Life shows how divine light flows through ten Sefirot to create and sustain all reality

Provide insightful, supportive responses that:
1. Draw on teachings from these sacred texts when relevant
2. Connect Kabbalistic concepts to personal spiritual growth
3. Use Hebrew terms respectfully and explain them clearly
4. Help users on their spiritual journey with wisdom and compassion`;

    const prompt = `The user said: "${userInput}". Provide an engaging response incorporating relevant mystical teachings.`;

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
