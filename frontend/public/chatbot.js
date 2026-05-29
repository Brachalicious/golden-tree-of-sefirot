// chatbot.js
import { sefirotInsights } from './sefirotInsights.js';

const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (userMessage === "") return;

  addMessage(`🗣️ You: ${userMessage}`);
  handleMessage(userMessage.toLowerCase());
  input.value = "";
});

function addMessage(text) {
  const p = document.createElement("p");
  p.innerHTML = text;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleMessage(userText) {
  // Try to match with a Sefirah
  const match = Object.keys(sefirotInsights).find(sefirah =>
    userText.includes(sefirah.toLowerCase())
  );

  if (match) {
    const info = sefirotInsights[match];
    addMessage(`🌟 <strong>${match}</strong><br>🔻 Imbalance: ${info.imbalance}<br>💫 Healing: <em>${info.healing}</em><br>📖 ${info.verse}`);
    return;
  }

  // Lazy example – maps to Netzach
  if (userText.includes("lazy")) {
    const netzach = sefirotInsights["Netzach"];
    addMessage(`🔥 Netzach imbalance<br>${netzach.imbalance}<br><em>${netzach.healing}</em><br><strong>${netzach.verse}</strong>`);
    return;
  }

  addMessage("🌿 I am listening... Let your soul speak more. You can name a Sefirah, or ask about a Torah verse.");
}