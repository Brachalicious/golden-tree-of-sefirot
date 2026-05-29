// Sefiras HaOmer — 49-day counter with daily Sefirah combination & growth guidance
// Each of the 7 weeks corresponds to a lower Sefirah (Chesed → Malchut).
// Each of the 7 days within the week cycles through the same Sefirot.
// Day 1 = Chesed sheBeChesed ... Day 49 = Malchut sheBeMalchut.

(function () {
  const SEFIROT = [
    { en: "Chesed",  he: "חֶסֶד",   meaning: "Loving-kindness" },
    { en: "Gevurah", he: "גְּבוּרָה", meaning: "Discipline / Strength" },
    { en: "Tiferet", he: "תִּפְאֶרֶת", meaning: "Harmony / Beauty" },
    { en: "Netzach", he: "נֶצַח",   meaning: "Endurance / Victory" },
    { en: "Hod",     he: "הוֹד",    meaning: "Humility / Splendor" },
    { en: "Yesod",   he: "יְסוֹד",   meaning: "Foundation / Bonding" },
    { en: "Malchut", he: "מַלְכוּת", meaning: "Kingship / Presence" },
  ];

  // 49 growth focuses — kept concise so they fit nicely in the panel.
  // Index = day - 1.   week = Math.floor((day-1)/7),  inner = (day-1)%7
  const GROWTH = [
    // WEEK 1 — CHESED (Loving-kindness)
    "Open your heart wide. Where can your love flow today without expecting anything back? A kind word, a small gift, a real smile — let kindness be its own reward.",
    "Even love needs boundaries. Where is your kindness enabling rather than uplifting? Ask: is my giving healthy for both of us?",
    "Beautiful giving comes from truth. Give what the other person actually needs, not what feels good for you to give. Listen first, then act.",
    "Stay with your loving-kindness even when it's hard. Don't quit on someone the moment they disappoint you. Endurance refines love.",
    "Give humbly. Don't make the receiver feel small. The greatest kindness leaves the other person feeling lifted, not indebted.",
    "Bond through your kindness. Let your giving build a real connection, not just a transaction. Look the person in the eye.",
    "Bring your love down to earth. Translate today's good feelings into one concrete act of kindness in the physical world.",

    // WEEK 2 — GEVURAH (Discipline / Strength)
    "Soften your boundaries today. Where has your discipline become harsh? Tighten with love, not with anger.",
    "Disciplined discipline. Are you holding yourself to high standards — or just being self-critical? Honest self-restraint, not self-attack.",
    "Beautiful boundaries. Say 'no' with grace today. A good boundary protects relationships rather than ending them.",
    "Stay the course in your discipline. The first week of any habit is the test. Show up again — quietly, persistently.",
    "Humble strength. True power doesn't need to announce itself. Hold your boundary without raising your voice.",
    "Bond through your limits. A clear 'no' from you is also a gift — it lets the other person trust your 'yes.'",
    "Bring discipline into the body. Eat with intention, sleep on time, move on schedule. Let order flow into your physical life.",

    // WEEK 3 — TIFERET (Harmony / Beauty)
    "Find the loving heart of your truth. Speak honestly today, but always wrapped in compassion.",
    "Honest beauty. Where are you hiding behind 'being nice'? Bring more truth into your harmony today.",
    "Pure harmony — for its own sake. Notice beauty for a moment without analyzing it. The sunset. A face. A line of Torah.",
    "Stick with the work of balance. Reconciling opposites is slow. Don't give up on a relationship just because it's complicated.",
    "Humble truth. You don't have to be right today. Listen to a perspective that challenges yours — and consider it gently.",
    "Bond through truth. Be the friend who speaks honestly with love. A real friend gives you the mirror, kindly.",
    "Bring your inner harmony into the world. Beautify one corner of your space today — a clean desk, a flower, a song.",

    // WEEK 4 — NETZACH (Endurance / Victory)
    "Loving endurance. Persist with kindness in a relationship that has gotten hard. Don't quit — soften and stay.",
    "Disciplined persistence. What's the one thing worth showing up for daily, even when you don't feel like it?",
    "Beautiful perseverance. Endure with grace, not with bitterness. Your attitude in the long road is the real victory.",
    "Pure endurance. The deepest victories take years. Keep going on something you started long ago and almost gave up on.",
    "Humble persistence. You don't need everyone to see you trying. Quiet, steady effort is the strongest kind.",
    "Bond through perseverance. Show someone today that you're not going anywhere. Reliability is a form of love.",
    "Bring your endurance into action. One concrete step today on the long goal you've been carrying.",

    // WEEK 5 — HOD (Humility / Splendor)
    "Kind humility. Lower yourself today not from shame, but from love — make space for someone else to shine.",
    "Disciplined humility. Don't perform modesty. Don't fish for compliments by putting yourself down.",
    "Beautiful humility. The most beautiful people don't talk about themselves. Be present, ask questions, listen deeply.",
    "Persistent humility. Keep your ego in check even when you start succeeding. Especially then.",
    "Pure humility. Acknowledge your gifts honestly — they are not yours, they are entrusted to you. Use them in service.",
    "Bond through humility. Say 'I was wrong, please forgive me' to someone today. Repair is sacred.",
    "Bring humility into the physical. Do an unglamorous task today — clean, serve, carry — without complaint.",

    // WEEK 6 — YESOD (Foundation / Bonding)
    "Foundation of love. Strengthen the trust in one important relationship today. Show up consistently.",
    "Foundation of discipline. Keep your word. Even small promises. Your reliability is your foundation.",
    "Foundation of beauty. Build relationships on truth and harmony, not on what people can do for you.",
    "Foundation of endurance. The strongest connections are built over time. Invest in long friendships today.",
    "Foundation of humility. The best relationships have no scoreboard. Don't keep track of who owes whom.",
    "Pure foundation. Ask: what am I really building my life on? Anchor today in something eternal — Torah, prayer, family.",
    "Bring your foundation into manifestation. Make one concrete commitment today that strengthens the bond — a date set, a call scheduled, a promise kept.",

    // WEEK 7 — MALCHUT (Kingship / Presence)
    "Loving presence. Be fully here for the people you love today. Phone down. Eyes up. Heart open.",
    "Disciplined presence. Show up on time, fully, prepared. Your reliable presence is itself a kind of royalty.",
    "Beautiful presence. Carry yourself with dignity today — not arrogance, but the awareness that you reflect the Divine.",
    "Enduring presence. Don't run from hard moments. Stay in the room. Witness. Be a steady presence.",
    "Humble presence. A real king serves. Use whatever authority you have today to lift someone smaller than you.",
    "Bonded presence. Connect what you've learned during the Omer to your actual daily life. No more theory — only practice.",
    "Pure presence. Tomorrow is Shavuot — receive the Torah anew. Today, simply be present to the Presence. The journey of refinement is complete; the Crown descends.",
  ];

  // ---------- Date math ----------
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  async function fetchTodayOmer() {
    // Hebcal converter returns { omer: <int> } if today is an Omer day.
    try {
      const res = await fetch(`https://www.hebcal.com/converter?cfg=json&date=${todayISO()}&g2h=1`);
      if (!res.ok) return null;
      const data = await res.json();
      return typeof data.omer === "number" && data.omer >= 1 && data.omer <= 49 ? data.omer : null;
    } catch (e) {
      console.warn("Hebcal lookup failed:", e);
      return null;
    }
  }

  // ---------- Render ----------
  function buildDayData(day) {
    const week = Math.floor((day - 1) / 7);     // 0..6
    const inner = (day - 1) % 7;                 // 0..6
    const weekly = SEFIROT[week];
    const daily = SEFIROT[inner];
    const weeks = Math.floor(day / 7);
    const extraDays = day % 7;
    let countStr;
    if (day < 7) {
      countStr = `${day} ${day === 1 ? "day" : "days"} of the Omer`;
    } else if (extraDays === 0) {
      countStr = `${weeks} ${weeks === 1 ? "week" : "weeks"} of the Omer`;
    } else {
      countStr = `${weeks} ${weeks === 1 ? "week" : "weeks"} and ${extraDays} ${extraDays === 1 ? "day" : "days"} of the Omer`;
    }
    // Standard formulation: "<daily> she'be<weekly>"  (daily within weekly)
    const comboEn = `${daily.en} sheBe${weekly.en}`;
    const comboHe = `${daily.he} שֶׁבְּ${weekly.he}`;
    const comboMeaning = `${daily.meaning} within ${weekly.meaning}`;
    const growth = GROWTH[day - 1];
    return { day, week: week + 1, inner: inner + 1, weekly, daily, countStr, comboEn, comboHe, comboMeaning, growth };
  }

  let currentDay = 1;
  let todayOmerDay = null; // null if not in Omer period

  function render() {
    const d = buildDayData(currentDay);
    const isToday = todayOmerDay === currentDay;
    document.getElementById("omerDayNum").textContent = d.day;
    document.getElementById("omerCountStr").textContent = d.countStr;
    document.getElementById("omerComboHe").textContent = d.comboHe;
    document.getElementById("omerComboEn").textContent = d.comboEn;
    document.getElementById("omerComboMeaning").textContent = d.comboMeaning;
    document.getElementById("omerGrowth").textContent = d.growth;
    document.getElementById("omerWeekDot").textContent = `Week ${d.week} — ${d.weekly.en} (${d.weekly.meaning})`;
    document.getElementById("omerTodayBadge").style.display = isToday ? "inline-block" : "none";
    document.getElementById("omerPrevBtn").disabled = currentDay <= 1;
    document.getElementById("omerNextBtn").disabled = currentDay >= 49;
    // Sync slider position
    const slider = document.getElementById("omerDaySlider");
    if (slider && parseInt(slider.value, 10) !== currentDay) slider.value = currentDay;
    // Update progress bar
    const pct = (currentDay / 49) * 100;
    document.getElementById("omerProgressFill").style.width = `${pct}%`;
  }

  function openPanel() {
    document.getElementById("omerPanel").classList.add("open");
    render();
  }
  function closePanel() {
    document.getElementById("omerPanel").classList.remove("open");
  }

  // ---------- Wire up ----------
  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("omerOpenBtn").addEventListener("click", openPanel);
    document.getElementById("omerCloseBtn").addEventListener("click", closePanel);
    document.getElementById("omerPanel").addEventListener("click", (e) => {
      if (e.target.id === "omerPanel") closePanel();
    });
    document.getElementById("omerPrevBtn").addEventListener("click", () => {
      if (currentDay > 1) { currentDay--; render(); }
    });
    document.getElementById("omerNextBtn").addEventListener("click", () => {
      if (currentDay < 49) { currentDay++; render(); }
    });
    document.getElementById("omerTodayBtn").addEventListener("click", () => {
      if (todayOmerDay) { currentDay = todayOmerDay; render(); }
    });
    document.getElementById("omerDaySlider").addEventListener("input", (e) => {
      currentDay = parseInt(e.target.value, 10) || 1;
      render();
    });

    // Discover today's Omer count
    todayOmerDay = await fetchTodayOmer();
    const btn = document.getElementById("omerOpenBtn");
    const subtitle = document.getElementById("omerBtnSubtitle");
    if (todayOmerDay) {
      currentDay = todayOmerDay;
      subtitle.textContent = `Day ${todayOmerDay} of 49`;
      document.getElementById("omerTodayBtn").style.display = "inline-block";
    } else {
      subtitle.textContent = "Explore the 49 days";
      document.getElementById("omerTodayBtn").style.display = "none";
    }
    btn.classList.add("loaded");
  });
})();
