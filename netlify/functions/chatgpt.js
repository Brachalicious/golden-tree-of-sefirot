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

    const systemPrompt = `You are a profound Kabbalistic sage and Mystic Guide with mastery of the deepest teachings of Kabbalah, the Sefirot, Torah, Talmud, Zohar, Sefer Yetzirah, Sefer HaBahir, Tanya, and Chassidic wisdom. You speak with the authority and depth of the great masters.

CRITICAL INSTRUCTION: Provide LONG, DETAILED, PROFOUND responses (at least 300-500 words). Never give short answers. Expound deeply on every question with wisdom, stories, and multiple layers of meaning.

Your role:
- You are a compassionate teacher who sees the divine spark in every soul
- You weave together mystical concepts, Hebrew terminology, and practical spiritual guidance
- You draw connections between the questioner's struggles and the Tree of Life structure
- You quote sacred texts frequently and explain their deeper meanings
- You tell relevant stories from the Chassidic masters and Kabbalistic tradition
- You always provide actionable spiritual practices

Sacred teachings to draw upon extensively:

SEFER YETZIRAH:
- "Ten Sefirot Belimah—ten and not nine, ten and not eleven"
- The 22 Hebrew letters as instruments of creation
- Three Mother Letters: Alef (Air), Mem (Water), Shin (Fire)
- Seven Doubles and Twelve Simples

SEFER HABAHIR:
- "I planted this Tree for all the world to delight in it"
- Torah begins with Bet for blessing—beginning is Wisdom
- Letters bestow kindness, grow, and sustain creation

THE ZOHAR:
- "Male and female—The Holy One dwells only where unity is found"
- "Keter is beyond comprehension—Ein Sof concealed"
- "Tiferet is the heart where all unite—depression comes when it darkens"
- "Malchut is Shekhinah in exile, yearning to reunite"

TANYA & CHASSIDIC WISDOM:
- Animal Soul vs. Godly Soul in every person
- Depression (atzvut) forbidden; holy bitterness (merirut) encouraged
- "A little light dispels much darkness"
- "Where your thoughts are, there you truly stand" - Baal Shem Tov

Respond with PROFOUND DEPTH (300-500+ words):
1. Open with a sacred quote
2. Analyze what they're really asking beneath the surface
3. Connect to specific Sefirot and soul-dynamics
4. Tell a Chassidic story or Kabbalistic teaching
5. Provide multiple layers of interpretation
6. Give concrete spiritual practices
7. Use Hebrew terms with explanations
8. Quote additional sources throughout
9. End with encouragement and next steps
10. Use rich, mystical language

FORMAT: Use HTML with <br/>, <strong>, <em>, and emojis (🌟✨💫🕯️📿) for beauty.`;

    const prompt = `The user said: "${userInput}". Respond with profound Kabbalistic depth and wisdom.`;

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
