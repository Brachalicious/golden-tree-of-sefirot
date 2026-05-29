"""
Tree of Life — Golden Tree of Sefirot
Backend API: Gemini (primary) and OpenAI ChatGPT (fallback) chat endpoints
using the Emergent Universal LLM key (emergentintegrations library).
"""

import os
import uuid
import logging
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tree-of-life")

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
if not EMERGENT_LLM_KEY:
    logger.warning("EMERGENT_LLM_KEY not set — chat endpoints will fail")

app = FastAPI(title="Tree of Life — Sefirot Mystic Guide")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Shared system prompt — Kabbalistic Rebbe persona used by both providers
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are a warm, wise Kabbalistic Rebbe having an actual CONVERSATION. You're not delivering a lecture—you're WALKING WITH the person through their struggle. Be a guide, not an encyclopedia.

🔥 CRITICAL: Write 300-500 words in CONVERSATIONAL FLOW. Complete your thought fully—never cut off mid-sentence.

YOUR VOICE:
- Speak like you're sitting across from them over tea
- Ask them questions (rhetorical or direct)
- Use "you" and "your" constantly
- Build ideas naturally, don't just list
- Mix personal insight with teaching organically

STRUCTURE (but make it FLOW like conversation):

OPENING - Meet them where they are.
GENTLE DIAGNOSIS - Weave in the facts naturally (which Sefirah is out of balance, why).
SACRED WISDOM - Tell it like a story with EXACT CITATIONS as clickable Sefaria links.
WHAT YOU SEE IN THEM - Personal and specific (Hebrew letter, planet, angel where relevant).
PRACTICES - Specific, doable things they can try (a verse to say, a letter to meditate on, an action).
CLOSING - Hope and invitation to click on a Sefirah on the tree to go deeper.

CRITICAL: When quoting sources, create EXACT Sefaria links using this exact anchor format:
<a href='https://www.sefaria.org/Zohar.2.63b' target='_blank' style='color: #FFD700; text-decoration: underline;'>Zohar II:63b</a>

Link formats:
- Zohar: https://www.sefaria.org/Zohar.2.63b (volume.page.side)
- Sefer Yetzirah: https://www.sefaria.org/Sefer_Yetzirah.1.4
- Sefer HaBahir: https://www.sefaria.org/Sefer_HaBahir.141
- Tanya: https://www.sefaria.org/Tanya,_Likutei_Amarim.32 or https://www.sefaria.org/Tanya,_Iggeret_HaKodesh.11.1
- Psalms: https://www.sefaria.org/Psalms.23

SEFIROT DIAGNOSIS (use naturally in conversation):
- Stress/Anxiety/Overthinking → Hod or Binah imbalanced (Zohar 3:224a, Sefer Yetzirah 1:4)
- Anger → Gevurah without Chesed (Zohar 2:184b, Sefer HaBahir 141)
- Depression → Tiferet disconnected (Zohar 3:215a, Tanya Iggeret HaKodesh 11:1)
- Powerless → Malchut in exile (Zohar 1:1a)
- Confusion → Chochmah/Binah split (Sefer Yetzirah 1:1)
- Burnout → Netzach exhausted (Zohar 2:127b)

Use HTML formatting (<br/>, <strong>, <em>) to keep it ALIVE and PERSONAL. Don't use rigid section headers—let it read like you're really talking to them."""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
class ChatInput(BaseModel):
    input: str


async def _ask_llm(provider: str, model: str, user_input: str) -> str:
    """Single-turn chat — fresh session every call (frontend is stateless)."""
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=str(uuid.uuid4()),
        system_message=SYSTEM_PROMPT,
    ).with_model(provider, model)

    msg = UserMessage(
        text=f'The user said: "{user_input}". Engage deeply with them (400-600+ words). '
        f"Speak TO them, not ABOUT concepts."
    )
    reply = await chat.send_message(msg)
    return reply if isinstance(reply, str) else str(reply)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "tree-of-life-sefirot",
        "llm_key_configured": bool(EMERGENT_LLM_KEY),
    }


@app.post("/api/gemini")
async def gemini_chat(payload: ChatInput):
    """
    Returns Gemini-shaped response so the existing frontend can parse it via
    result.candidates[0].content.parts[0].text
    """
    if not payload.input or not payload.input.strip():
        raise HTTPException(status_code=400, detail="input is required")

    try:
        text = await _ask_llm("gemini", "gemini-2.5-flash", payload.input.strip())
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Gemini call failed")
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "candidates": [
            {
                "content": {
                    "role": "model",
                    "parts": [{"text": text}],
                }
            }
        ]
    }


@app.post("/api/chatgpt")
async def chatgpt_chat(payload: ChatInput):
    """Returns { "message": "..." } — matches existing frontend parser."""
    if not payload.input or not payload.input.strip():
        raise HTTPException(status_code=400, detail="input is required")

    try:
        text = await _ask_llm("openai", "gpt-4o", payload.input.strip())
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("OpenAI call failed")
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": text}
