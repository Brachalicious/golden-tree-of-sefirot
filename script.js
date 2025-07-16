const sefirotMap = [
  {
    name: "Keter",
    keywords: ["no will", "empty", "directionless", "disconnected from Hashem"],
    insight: `
      👑 <strong>Keter imbalance</strong><br/>
      <strong>Animal Soul:</strong> Loss of purpose, apathy<br/>
      <strong>Godly Soul:</strong> Deep will and delight in divine unity<br/>
      ✨ Keter is the crown — the transcendent root of all Sefirot, containing both Ratzon (will) and Oneg (delight).<br/>
      📖 "With You is the source of life; in Your light, we see light." (Psalms 36:10)<br/>
      <strong>Angels:</strong> Aralim (Thrones)<br/>
      <strong>Aleph Bet:</strong> Aleph (א) — Oneness, divine source<br/>
      <strong>Planet:</strong> Divine beyond — not bound to planetary influence.
    `
  },
  {
    name: "Chochmah",
    keywords: ["confused", "no insight", "mental block", "frozen"],
    insight: `
      💡 <strong>Chochmah imbalance</strong><br/>
      <strong>Animal Soul:</strong> Rashness, lack of clarity, confusion<br/>
      <strong>Godly Soul:</strong> Flash of divine insight, intuitive knowing<br/>
      🌟 Chochmah is the first spark of wisdom, the seed of all intellect and consciousness.<br/>
      📖 "God founded the earth with wisdom." (Proverbs 3:19)<br/>
      <strong>Angels:</strong> Ophanim (Wheels)<br/>
      <strong>Aleph Bet:</strong> Bet (ב) — duality, creation<br/>
      <strong>Planet:</strong> Uranus (in mystical interpretation) — sudden revelation.
    `
  },
  {
    name: "Binah",
    keywords: ["overthinking", "mental loops", "no understanding", "too much logic"],
    insight: `
      🧠 <strong>Binah imbalance</strong><br/>
      <strong>Animal Soul:</strong> Over-analysis, anxiety, rigidity<br/>
      <strong>Godly Soul:</strong> Discernment, deep understanding, teshuvah<br/>
      🕊️ Binah is the womb of intellect — it develops the flash of Chochmah into full understanding.<br/>
      📖 "With understanding, He established the heavens." (Proverbs 3:19)<br/>
      <strong>Angels:</strong> Erelim (Valiant Ones)<br/>
      <strong>Aleph Bet:</strong> Gimel (ג) — nurturing, giving<br/>
      <strong>Planet:</strong> Saturn — boundaries, form, contemplation.
    `
  },
  {
    name: "Netzach",
    keywords: ["quitting", "defeated", "can't keep going", "burned out"],
    insight: `
      🛡️ <strong>Netzach imbalance</strong><br/>
      <strong>Animal Soul:</strong> Burnout, ego drive, domination<br/>
      <strong>Godly Soul:</strong> Endurance, holy ambition, victory through faith<br/>
      🥇 Netzach is the divine attribute of victory and perseverance — the long road with courage.<br/>
      📖 "His mercy endures forever." (Psalms 136, repeated refrain)<br/>
      <strong>Angels:</strong> Elohim Tzevaot<br/>
      <strong>Aleph Bet:</strong> Nun (נ) — falling and rising<br/>
      <strong>Planet:</strong> Venus — endurance of love and beauty.
    `
  },
  {
    name: "Hod",
    keywords: ["shame", "self-hate", "doubt", "can't receive", "collapsed"],
    insight: `
      🌈 <strong>Hod imbalance</strong><br/>
      <strong>Animal Soul:</strong> Shame, denial, resentment<br/>
      <strong>Godly Soul:</strong> Gratitude, humility, surrender<br/>
      📿 Hod is the majesty of submission and sincerity — the echo that follows Netzach's shout.<br/>
      📖 "Give thanks to Hashem for He is good." (Psalms 118:1)<br/>
      <strong>Angels:</strong> Benei Elohim (Sons of God)<br/>
      <strong>Aleph Bet:</strong> Samekh (ס) — support, trust<br/>
      <strong>Planet:</strong> Mercury — communication, sincerity.
    `
  },
  {
    name: "Genesis 3:22",
    keywords: ["tree of life", "live forever", "genesis 3:22"],
    insight: `
      📖 <strong>Genesis 3:22</strong><br/>
      "And the Lord God said, 'Behold, the man is become as one of us, to know good and evil; and now, lest he put forth his hand, and take also of the tree of life, and eat, and live forever..."<br/><br/>
      🌳 <strong>Sefirah Connection:</strong> <strong>Yesod</strong> (Foundation) and <strong>Malchut</strong> (Kingdom/Shechinah)<br/>
      In Jewish mystical tradition, the <strong>Tree of Life</strong> is the structure of the Sefirot, especially the central column (Keter → Tiferet → Yesod → Malchut).<br/><br/>
      - <strong>Yesod</strong> channels divine energy from above into the world below — it is the <em>tzadik</em>, the foundation of the world.<br/>
      - <strong>Malchut</strong> is the vessel and final receiver of all divine influence — the realm of manifestation and presence.<br/><br/>
      🍃 <strong>Insight:</strong> After the sin, access to eternal life (the pure, direct flow from Yesod to Malchut) was cut off. The unity was fractured.<br/><br/>
      ❗God's action in this verse reflects the spiritual reality: humanity, in an unrectified state, could not receive eternal divine flow without fixing the breach in the Sefirotic pipeline.<br/><br/>
      🕯️ <strong>Healing:</strong> Restoration of this flow comes through rectifying Yesod (foundation, purity) and elevating Malchut (faithful presence) to once again receive from the Tree of Life.
    `
  }
];

function diagnoseSefirah(userInput) {
  const input = userInput.toLowerCase();

  for (let sefirah of sefirotMap) {
    if (sefirah.keywords.some(kw => input.includes(kw))) {
      return sefirah.insight;
    }
  }

  return `
    🌿 I am listening... Let your soul speak more.<br/>
    You can name a Sefirah, or share what burdens your heart.<br/>
    Or ask about a verse in Tanakh and I’ll relate it to the Tree of Life ✨
  `;
}

// Inject into chatbot logic
window.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatContent = document.getElementById("chat-content");

  if (chatInput && chatContent) {
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const msg = chatInput.value.trim();
        if (!msg) return;

        const userMsg = document.createElement("div");
        userMsg.textContent = "🗣️ You: " + msg;
        chatContent.appendChild(userMsg);

        const botReply = document.createElement("div");
        botReply.classList.add("mt-1");
        botReply.innerHTML = diagnoseSefirah(msg);

        chatContent.appendChild(botReply);
        chatInput.value = '';
        chatContent.scrollTop = chatContent.scrollHeight;
      }
    });
  }
});
