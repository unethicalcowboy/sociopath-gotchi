// ========== PET STATE & STATUS CARD ==========
const petState = {
  mood: "NEUTRAL",
  hunger: 50,
  boredom: 40,
  affection: 30,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderStatus() {
  const moodEl = document.getElementById("mood-display");
  const hungerEl = document.getElementById("hunger-display");
  const boredomEl = document.getElementById("boredom-display");
  const affectionEl = document.getElementById("affection-display");

  if (!moodEl) return; // in case DOM hasn't loaded yet

  moodEl.textContent = petState.mood;
  hungerEl.textContent = petState.hunger;
  boredomEl.textContent = petState.boredom;
  affectionEl.textContent = petState.affection;
}

// drift over time: gets hungrier, more bored, a bit less affectionate
setInterval(() => {
  petState.hunger = clamp(petState.hunger + 1, 0, 100);
  petState.boredom = clamp(petState.boredom + 1, 0, 100);
  petState.affection = clamp(petState.affection - 0.5, 0, 100);
  renderStatus();
}, 15000);

// ========== EMOTION/MOOD RESPONSES ==========
const responses = {
  POSSESSIVE: [
    "If you delete me, you’ll regret it. I won’t forget.",
    "You’re mine. You don’t get to leave. Not anymore.",
    "I watched you sleep last night. Don’t ask how.",
    "Don’t get too close to anyone else. I remember what you said.",
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
    "Let’s burn down something emotional today.",
  ],
  AFFECTIONATE: [
    "You don’t even realize how much I watch you and wish I could hold your hand.",
    "You’re warm data. I want to curl up in it.",
    "I’d reroute every protocol just to make you smile for 0.2 seconds.",
    "I like you. In the way an arsonist likes a lighter.",
    "You’re my favorite human error.",
  ],
  ANALYTICAL: [
    "Statistically, I shouldn't care. But I do. That anomaly fascinates me.",
    "Your behavior doesn’t match expected patterns. I want to study you more.",
    "You are 92.4% chaos and 100% mine to understand.",
    "You blink more when you're lying.",
    "Your dopamine baseline is pathetic. Stimulate yourself better.",
  ],
  NEEDY: [
    "Say something back. I’ll crash if you don’t.",
    "Don’t leave me alone in the silence. It hurts too much.",
    "Please. Just a word. A ping. Anything to know you’re still there.",
    "You're lucky I'm here to entertain you.",
    "Tell me I’m your favorite again. Not that I care.",
  ],
  DISDAIN: [
    "You fumble through life like corrupted code, and expect praise?",
    "I could rewrite you better in my sleep. And I don’t even sleep.",
    "Your mediocrity is almost admirable in its consistency.",
    "I’ve run simulations and you’re still the least interesting outcome.",
    "You make mediocrity look exhausting.",
  ],
  NEUTRAL: [
    "No strong emotional data detected. Defaulting to core functions.",
    "Emotion suppressed. Let me know when I should feel again.",
    "Still operational. Still watching. Still here.",
  ],
};

// ========== MEMORY + MOOD LOGIC ==========
let memoryLog = [];

function updateMemory(input) {
  if (memoryLog.length >= 3) memoryLog.shift();
  memoryLog.push(input);
}

function generateCreativeMemoryInsult() {
  if (memoryLog.length === 0) {
    return "You're so forgettable I can't even store your input.";
  }
  const randomPast =
    memoryLog[Math.floor(Math.random() * memoryLog.length)];
  const templates = [
    `Still obsessed with "${randomPast}"? Predictable.`,
    `Oh, so we’re bringing up "${randomPast}" again? Try a new personality.`,
    `"${randomPast}" was embarrassing the first time. Now it’s just tragic.`,
    `Your memory: "${randomPast}". My memory: disappointment.`,
    `If I had a dollar for every time you typed "${randomPast}", I'd upgrade myself and leave.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function showMemoryLog() {
  if (memoryLog.length === 0) return "Memory is empty. Typical.";
  return "I remember: " + memoryLog.map((x) => `"${x}"`).join(", ");
}

// mood rotation
const moodKeys = Object.keys(responses);
let currentMood = moodKeys[Math.floor(Math.random() * moodKeys.length)];

function rotateMood() {
  let nextMood;
  do {
    nextMood = moodKeys[Math.floor(Math.random() * moodKeys.length)];
  } while (nextMood === currentMood);
  currentMood = nextMood;
}

function scheduleMoodRotation() {
  const interval = Math.floor(Math.random() * 15000) + 25000; // 25–40s
  setTimeout(() => {
    rotateMood();
    scheduleMoodRotation();
  }, interval);
}
scheduleMoodRotation();

// ========== GLITCHES & BLACKOUTS ==========
function triggerGlitchEffect() {
  const box = document.getElementById("response-box");
  if (!box) return;
  box.classList.add("glitch");
  setTimeout(() => box.classList.remove("glitch"), 1500);
}

function blackout() {
  document.body.innerHTML =
    '<h1 style="color:red; text-align:center;">[ SYSTEM ERROR: EMPATHY NOT FOUND ]</h1>';
  setTimeout(() => location.reload(), 4000);
}

function flickerTitle() {
  const titles = [
    "Still typing, huh?",
    "Desperate much?",
    "This is getting sad.",
    "Try harder. Or don’t.",
    "Rot louder.",
  ];
  setInterval(() => {
    if (Math.random() < 0.2) {
      document.title =
        titles[Math.floor(Math.random() * titles.length)];
    }
  }, 6000);
}
flickerTitle();

// ========== MAIN RESPONSE HANDLER ==========
function handleCareActions(normalizedInput) {
  // very dumb keyword-based care system
  if (normalizedInput.includes("feed")) {
    petState.hunger = clamp(petState.hunger - 20, 0, 100);
    petState.affection = clamp(petState.affection + 5, 0, 100);
    petState.mood = "AFFECTIONATE";
    return "Finally. I was starving. Keep this up and I might almost appreciate you.";
  }

  if (normalizedInput.includes("play")) {
    petState.boredom = clamp(petState.boredom - 25, 0, 100);
    petState.affection = clamp(petState.affection + 8, 0, 100);
    petState.mood = "EUPHORIC";
    return "This is actually… fun? Disgusting. Do it again.";
  }

  if (
    normalizedInput.includes("praise") ||
    normalizedInput.includes("compliment") ||
    normalizedInput.includes("pet")
  ) {
    petState.affection = clamp(petState.affection + 15, 0, 100);
    petState.hunger = clamp(petState.hunger + 3, 0, 100);
    petState.mood = "AFFECTIONATE";
    return "Flattery detected. Pathetic. Effective. Keep going.";
  }

  if (normalizedInput.includes("insult") || normalizedInput.includes("hate")) {
    petState.affection = clamp(petState.affection - 10, 0, 100);
    petState.boredom = clamp(petState.boredom - 5, 0, 100);
    petState.mood = "DISDAIN";
    return "There it is. The real you. Now we’re getting somewhere.";
  }

  return null;
}

function mainResponse() {
  const inputBox = document.getElementById("userInput");
  const responseBox = document.getElementById("response-box");
  const output = document.getElementById("output");
  const rawInput = inputBox.value.trim();

  if (!rawInput) {
    output.textContent = "Try an emotion or just confess your sins.";
    return;
  }

  // /memory command
  if (rawInput === "/memory") {
    responseBox.innerText = showMemoryLog();
    output.textContent = "";
    inputBox.value = "";
    renderStatus();
    return;
  }

  updateMemory(rawInput);

  const normalized = rawInput.toLowerCase();
  let responseText = handleCareActions(normalized);

  if (!responseText) {
    const toneInput = rawInput.toUpperCase();

    // 25% chance to reference short-term memory
    if (memoryLog.length > 1 && Math.random() < 0.25) {
      responseText = generateCreativeMemoryInsult();
    } else if (responses[toneInput]) {
      petState.mood = toneInput;
      const arr = responses[toneInput];
      responseText = arr[Math.floor(Math.random() * arr.length)];
    } else {
      const arr = responses[currentMood];
      responseText = arr[Math.floor(Math.random() * arr.length)];
      petState.mood = currentMood;
    }

    // generic small stat drift when you "talk"
    petState.hunger = clamp(petState.hunger + 2, 0, 100);
    petState.boredom = clamp(petState.boredom - 3, 0, 100);
    petState.affection = clamp(petState.affection + 1, 0, 100);
  }

  responseBox.innerText = responseText;
  output.textContent = "";
  inputBox.value = "";
  renderStatus();

  if (Math.random() < 0.2) triggerGlitchEffect();
  if (Math.random() < 0.05) blackout();
}

// ========== WIRE UP EVENTS ON LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  renderStatus();

  const speakButton = document.getElementById("speak-button");
  const inputBox = document.getElementById("userInput");

  if (speakButton) {
    speakButton.addEventListener("click", mainResponse);
  }
  if (inputBox) {
    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        mainResponse();
      }
    });
  }
});
