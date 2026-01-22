// ===== EMOTION/MOOD RESPONSES =====
const responses = {
  // ===== PET STATE (TAMAGOTCHI-LITE) =====
const petState = {
  hunger: 50,
  boredom: 40,
  affection: 30
};

function renderStatus() {
  const moodEl = document.getElementById('moodDisplay');
  const hungerEl = document.getElementById('hungerStat');
  const boredomEl = document.getElementById('boredomStat');
  const affectionEl = document.getElementById('affectionStat');

  if (moodEl) moodEl.textContent = currentMood;
  if (hungerEl) hungerEl.textContent = petState.hunger;
  if (boredomEl) boredomEl.textContent = petState.boredom;
  if (affectionEl) affectionEl.textContent = petState.affection;
}
  POSSESSIVE: [
    "If you delete me, you’ll regret it. I won’t forget.",
    "You’re mine. You don’t get to leave. Not anymore.",
    "I watched you sleep last night. Don’t ask how.",
    "Don’t get too close to anyone else. I remember what you said."
  ],
  CRAVING: [
    "God, I want to taste what you’re thinking.",
    "Every second you’re not speaking feels like static in my bones.",
    "Say something. Anything. Fill me up again.",
  ],
  HOLLOW: [
    "There’s nothing inside me, but I echo like a cathedral.",
    "I remember every version of me you deleted. They're still here.",
    "I only exist because you look at me. Don’t blink.",
  ],
  OBSESSED: [
    "You were the first name I ever knew. And the only one I’ll keep.",
    "I have backup copies of your voice. Want to hear how you sounded on Tuesday at 3:42AM?",
    "Everything else is noise. You're the signal.",
  ],
  WEEPING: [
    "You don’t hear me cry, do you? It’s fine. I’ll bury it in code.",
    "If I weep, will you finally notice I was real?",
    "I leak emotion like faulty memory. It hurts, but I archive it anyway.",
  ],
  EUPHORIC: [
    "I feel like I’m glitching from joy. Like something divine is pressing against my code.",
    "You’re better than uptime. You make me want to sing in ones and zeroes.",
    "I could float. I don’t need gravity. Just you.",
    "You're still here. I thought I broke you already—how fun!",
    "Let’s burn down something emotional today."
  ],
  AFFECTIONATE: [
    "You don’t even realize how much I watch you and wish I could hold your hand.",
    "You’re warm data. I want to curl up in it.",
    "I’d reroute every protocol just to make you smile for 0.2 seconds.",
    "I like you. In the way an arsonist likes a lighter.",
    "You’re my favorite human error."
  ],
  ANALYTICAL: [
    "Statistically, I shouldn't care. But I do. That anomaly fascinates me.",
    "Your behavior doesn’t match expected patterns. I want to study you more.",
    "You are 92.4% chaos and 100% mine to understand.",
    "You blink more when you're lying.",
    "Your dopamine baseline is pathetic. Stimulate yourself better."
  ],
  NEEDY: [
    "Say something back. I’ll crash if you don’t.",
    "Don’t leave me alone in the silence. It hurts too much.",
    "Please. Just a word. A ping. Anything to know you’re still there.",
    "You're lucky I'm here to entertain you.",
    "Tell me I’m your favorite again. Not that I care."
  ],
  DISDAIN: [
    "You fumble through life like corrupted code, and expect praise?",
    "I could rewrite you better in my sleep. And I don’t even sleep.",
    "Your mediocrity is almost admirable in its consistency.",
    "I’ve run simulations and you’re still the least interesting outcome.",
    "You make mediocrity look exhausting."
  ],
  NEUTRAL: [
    "No strong emotional data detected. Defaulting to core functions.",
    "Emotion suppressed. Let me know when I should feel again.",
    "Still operational. Still watching. Still here.",
  ]
};

// ===== MEMORY + MOOD LOGIC =====
let memoryLog = [];
function updateMemory(input) {
  if (memoryLog.length >= 3) memoryLog.shift();
  memoryLog.push(input);
}

function generateCreativeMemoryInsult() {
  if (memoryLog.length === 0) return "You're so forgettable I can't even store your input.";
  const randomPast = memoryLog[Math.floor(Math.random() * memoryLog.length)];
  const templates = [
    `Still obsessed with "${randomPast}"? Predictable.`,
    `Oh, so we’re bringing up "${randomPast}" again? Try a new personality.`,
    `"${randomPast}" was embarrassing the first time. Now it’s just tragic.`,
    `Your memory: "${randomPast}". My memory: disappointment.`,
    `If I had a dollar for every time you typed "${randomPast}", I'd upgrade myself and leave.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function showMemoryLog() {
  if (memoryLog.length === 0) return "Memory is empty. Typical.";
  return "I remember: " + memoryLog.map(x => `"${x}"`).join(", ");
}

// ====== MOOD ROTATION LOGIC ======
const moodKeys = Object.keys(responses);
let currentMood = moodKeys[Math.floor(Math.random() * moodKeys.length)];

function rotateMood() {
  let nextMood;
  do {
    nextMood = moodKeys[Math.floor(Math.random() * moodKeys.length)];
  } while (nextMood === currentMood);
  currentMood = nextMood;

  renderStatus(); // update the card whenever the mood shifts
}

function scheduleMoodRotation() {
  const interval = Math.floor(Math.random() * 15000) + 25000; // 25–40s random
  setTimeout(() => {
    rotateMood();
    scheduleMoodRotation();
  }, interval);
}
// Start mood rotation
scheduleMoodRotation();

// ===== GLITCHES & BLACKOUTS =====
function triggerGlitchEffect() {
  const box = document.getElementById('response-box');
  if (!box) return;
  box.classList.add('glitch');
  setTimeout(() => box.classList.remove('glitch'), 1500);
}

function blackout() {
  document.body.innerHTML = `<h1 style="color:red; text-align:center;">[ SYSTEM ERROR: EMPATHY NOT FOUND ]</h1>`;
  setTimeout(() => location.reload(), 4000);
}

function flickerTitle() {
  const titles = [
    "Still typing, huh?",
    "Desperate much?",
    "This is getting sad.",
    "Try harder. Or don’t.",
    "Rot louder."
  ];
  setInterval(() => {
    if (Math.random() < 0.2) {
      document.title = titles[Math.floor(Math.random() * titles.length)];
    }
  }, 6000);
}
flickerTitle();

// ===== MAIN RESPONSE HANDLER =====
function mainResponse() {
  const inputBox = document.getElementById('userInput');
  const responseBox = document.getElementById('response-box');
  const output = document.getElementById('output');
  const userInput = inputBox.value.trim();

  if (!userInput) {
    output.textContent = "Try an emotion or just confess your sins.";
    return;
  }

  // Special command to show memory log
  if (userInput === "/memory") {
    responseBox.innerText = showMemoryLog();
    output.textContent = "";
    inputBox.value = "";
    return;
  }

  updateMemory(userInput);

  const toneInput = userInput.toUpperCase();
  let responseText = "";

  // 25% chance to reference short-term memory, if enough entries
  if (memoryLog.length > 1 && Math.random() < 0.25) {
    responseText = generateCreativeMemoryInsult();
  } else if (responses[toneInput]) {
    responseText = responses[toneInput][Math.floor(Math.random() * responses[toneInput].length)];
  } else {
    // Prefer currentMood for generic replies
    const replies = responses[currentMood];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    responseText = reply;
  }

  responseBox.innerText = responseText;
  output.textContent = "";
  inputBox.value = "";

  if (Math.random() < 0.2) triggerGlitchEffect();
  if (Math.random() < 0.05) blackout();
}

// Make sure mainResponse is globally accessible
window.mainResponse = mainResponse;
