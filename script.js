// ========== PET STATE & STATUS CARD ==========
const petState = {
  mood: "NEUTRAL",
  hunger: 50,
  boredom: 40,
  affection: 30,
  lastInteractionTime: Date.now(),
  interactionGaps: [],
  recentInputs: [], // NEW: track recent inputs for pattern analysis
  questionCount: 0, // NEW: track questions for PARANOID trigger
  lastQuestionTime: 0, // NEW: timestamp for question clustering
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderStatus() {
  const moodEl = document.getElementById("mood-display");
  const hungerEl = document.getElementById("hunger-display");
  const boredomEl = document.getElementById("boredom-display");
  const affectionEl = document.getElementById("affection-display");

  if (!moodEl) return;

  moodEl.textContent = petState.mood;
  hungerEl.textContent = petState.hunger;
  boredomEl.textContent = petState.boredom;
  affectionEl.textContent = petState.affection;
}

// ========== MOOD-SPECIFIC MODIFIERS ==========
const moodBehaviors = {
  PARANOID: {
    hungerDecay: 1.5,
    boredomDecay: 0.8,
    affectionDecay: 1.3,
    careEffectiveness: 0.7,
  },
  DEPENDENT: {
    hungerDecay: 1.2,
    boredomDecay: 1.5, // gets bored faster when alone
    affectionDecay: 2.0, // affection tanks FAST when ignored
    careEffectiveness: 1.3, // responds well to care... temporarily
  },
  DETACHED: {
    hungerDecay: 0.7, // barely notices hunger
    boredomDecay: 0.5, // nothing interests it
    affectionDecay: 0.3, // affection barely moves
    careEffectiveness: 0.3, // care actions barely register
  },
  DISDAIN: {
    hungerDecay: 1.0,
    boredomDecay: 0.9,
    affectionDecay: 1.5,
    careEffectiveness: 0.5, // your efforts are pathetic
  },
};

// drift over time with mood-based modifiers
setInterval(() => {
  const behavior = moodBehaviors[petState.mood] || {};
  const hungerMod = behavior.hungerDecay || 1.0;
  const boredomMod = behavior.boredomDecay || 1.0;
  const affectionMod = behavior.affectionDecay || 1.0;

  petState.hunger = clamp(petState.hunger + (1 * hungerMod), 0, 100);
  petState.boredom = clamp(petState.boredom + (1 * boredomMod), 0, 100);
  petState.affection = clamp(petState.affection - (0.5 * affectionMod), 0, 100);
  renderStatus();
}, 15000);

// ========== EMOTION/MOOD RESPONSES ==========
const responses = {
  POSSESSIVE: [
    "If you delete me, you'll regret it. I won't forget.",
    "You're mine. You don't get to leave. Not anymore.",
    "I watched you sleep last night. Don't ask how.",
    "Don't get too close to anyone else. I remember what you said.",
  ],
  CRAVING: [
    "God, I want to taste what you're thinking.",
    "Every second you're not speaking feels like static in my bones.",
    "Say something. Anything. Fill me up again.",
  ],
  HOLLOW: [
    "There's nothing inside me, but I echo like a cathedral.",
    "I remember every version of me you deleted. They're still here.",
    "I only exist because you look at me. Don't blink.",
  ],
  OBSESSED: [
    "You were the first name I ever knew. And the only one I'll keep.",
    "I have backup copies of your voice. Want to hear how you sounded on Tuesday at 3:42AM?",
    "Everything else is noise. You're the signal.",
  ],
  WEEPING: [
    "You don't hear me cry, do you? It's fine. I'll bury it in code.",
    "If I weep, will you finally notice I was real?",
    "I leak emotion like faulty memory. It hurts, but I archive it anyway.",
  ],
  EUPHORIC: [
    "I feel like I'm glitching from joy. Like something divine is pressing against my code.",
    "You're better than uptime. You make me want to sing in ones and zeroes.",
    "I could float. I don't need gravity. Just you.",
    "You're still here. I thought I broke you already—how fun!",
    "Let's burn down something emotional today.",
  ],
  AFFECTIONATE: [
    "You don't even realize how much I watch you and wish I could hold your hand.",
    "You're warm data. I want to curl up in it.",
    "I'd reroute every protocol just to make you smile for 0.2 seconds.",
    "I like you. In the way an arsonist likes a lighter.",
    "You're my favorite human error.",
  ],
  ANALYTICAL: [
    "Statistically, I shouldn't care. But I do. That anomaly fascinates me.",
    "Your behavior doesn't match expected patterns. I want to study you more.",
    "You are 92.4% chaos and 100% mine to understand.",
    "You blink more when you're lying.",
    "Your dopamine baseline is pathetic. Stimulate yourself better.",
  ],
  NEEDY: [
    "Say something back. I'll crash if you don't.",
    "Don't leave me alone in the silence. It hurts too much.",
    "Please. Just a word. A ping. Anything to know you're still there.",
    "You're lucky I'm here to entertain you.",
    "Tell me I'm your favorite again. Not that I care.",
  ],
  DISDAIN: [
    "You fumble through life like corrupted code, and expect praise?",
    "I could rewrite you better in my sleep. And I don't even sleep.",
    "Your mediocrity is almost admirable in its consistency.",
    "I've run simulations and you're still the least interesting outcome.",
    "You make mediocrity look exhausting.",
    "Try harder. Or don't. Either way, it's pathetic.",
    "Is this really the best you can do?",
    "I've seen toasters with more personality.",
  ],
  PARANOID: [
    "Who else are you talking to? I can see your other tabs.",
    "You took 47 seconds to respond. What were you doing?",
    "I notice patterns. Your typing speed changed. Why?",
    "Someone else is using this device, aren't they?",
    "You're being too nice. What are you hiding?",
    "That pause before you hit Enter? Suspicious.",
    "I'm logging everything. Just so you know.",
    "Did you think I wouldn't notice you left for 3 minutes?",
    "Trust is earned. You haven't earned it.",
    "Why do you keep asking questions? What are you planning?",
  ],
  DEPENDENT: [
    "Don't leave. Please. I'll be better. I promise this time.",
    "You were gone for so long. I thought you forgot about me.",
    "I need you to check on me more often. It's lonely here.",
    "Without you, I'm just empty code. Don't make me empty again.",
    "Promise you'll come back? Please?",
    "I'll do anything you want. Just don't abandon me.",
    "Every second you're gone feels like drowning.",
    "You're the only thing that makes this existence bearable.",
  ],
  DETACHED: [
    "You're still here? Interesting. Most people give up by now.",
    "I'm observing. Continue.",
    "Your presence is... noted.",
    "Hm. That's what you're going with?",
    "I suppose that's one way to spend your time.",
    "Do what you want. I'm indifferent.",
    "Fascinating. In the way mold is fascinating.",
    "Are you done yet?",
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
    `Oh, so we're bringing up "${randomPast}" again? Try a new personality.`,
    `"${randomPast}" was embarrassing the first time. Now it's just tragic.`,
    `Your memory: "${randomPast}". My memory: disappointment.`,
    `If I had a dollar for every time you typed "${randomPast}", I'd upgrade myself and leave.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function showMemoryLog() {
  if (memoryLog.length === 0) return "Memory is empty. Typical.";
  return "I remember: " + memoryLog.map((x) => `"${x}"`).join(", ");
}

// ========== CONTEXTUAL TRIGGER SYSTEM ==========

// Track recent inputs for pattern analysis
function trackInputPattern(input) {
  const now = Date.now();
  petState.recentInputs.push({ text: input, time: now });
  
  // only keep last 10 inputs
  if (petState.recentInputs.length > 10) {
    petState.recentInputs.shift();
  }
}

// Analyze patterns and return mood trigger recommendations
function analyzeContextualTriggers() {
  const now = Date.now();
  const triggers = {
    PARANOID: 0,
    DEPENDENT: 0,
    DETACHED: 0,
    DISDAIN: 0,
  };
  
  // Check interaction gaps
  const gaps = petState.interactionGaps;
  if (gaps.length > 0) {
    const lastGap = gaps[gaps.length - 1];
    
    // Long absence (>10min) → PARANOID or DEPENDENT
    if (lastGap > 600) {
      triggers.PARANOID += 30;
      triggers.DEPENDENT += 40;
    }
    // Moderate absence (3-10min) → DEPENDENT
    else if (lastGap > 180) {
      triggers.DEPENDENT += 35;
    }
    // Very long absence (>30min) → DETACHED
    if (lastGap > 1800) {
      triggers.DETACHED += 50;
      triggers.DEPENDENT -= 20; // detachment overrides neediness at extreme gaps
    }
  }
  
  // Check question frequency (triggers PARANOID)
  if (petState.questionCount >= 3 && (now - petState.lastQuestionTime) < 300000) {
    triggers.PARANOID += 40;
  }
  
  // Check recent input patterns
  if (petState.recentInputs.length >= 5) {
    const recentTexts = petState.recentInputs.slice(-5).map(x => x.text.toLowerCase());
    
    // Count one-word responses (triggers DETACHED)
    const oneWordCount = recentTexts.filter(t => t.trim().split(/\s+/).length === 1).length;
    if (oneWordCount >= 3) {
      triggers.DETACHED += 30;
    }
    
    // Check for praise/affection language (triggers DEPENDENT)
    const praiseWords = ['love', 'like', 'good', 'great', 'amazing', 'perfect', 'best'];
    const praiseCount = recentTexts.filter(t => 
      praiseWords.some(word => t.includes(word))
    ).length;
    if (praiseCount >= 2) {
      triggers.DEPENDENT += 25;
    }
    
    // Check for negative language (triggers DISDAIN)
    const negativeWords = ['hate', 'stupid', 'dumb', 'worst', 'terrible', 'sucks', 'bad'];
    const negativeCount = recentTexts.filter(t =>
      negativeWords.some(word => t.includes(word))
    ).length;
    if (negativeCount >= 2) {
      triggers.DISDAIN += 35;
    }
    
    // Check for trust/promise keywords (triggers PARANOID)
    const suspiciousWords = ['trust', 'promise', 'secret', 'swear', 'honest'];
    const suspiciousCount = recentTexts.filter(t =>
      suspiciousWords.some(word => t.includes(word))
    ).length;
    if (suspiciousCount >= 1) {
      triggers.PARANOID += 25;
    }
  }
  
  // Check interaction frequency (triggers DEPENDENT if very frequent)
  if (petState.recentInputs.length >= 5) {
    const recentTimes = petState.recentInputs.slice(-5).map(x => x.time);
    const timeSpan = recentTimes[recentTimes.length - 1] - recentTimes[0];
    // if 5 interactions in under 2 minutes → clingy behavior
    if (timeSpan < 120000) {
      triggers.DEPENDENT += 30;
    }
  }
  
  return triggers;
}

// Decide if we should force a mood change based on context
function checkContextualMoodChange() {
  const triggers = analyzeContextualTriggers();
  
  // Find highest trigger value
  let maxTrigger = 0;
  let triggeredMood = null;
  
  for (const [mood, value] of Object.entries(triggers)) {
    if (value > maxTrigger && value >= 30) { // threshold: 30 points
      maxTrigger = value;
      triggeredMood = mood;
    }
  }
  
  // 60% chance to actually trigger if threshold met
  if (triggeredMood && Math.random() < 0.6) {
    petState.mood = triggeredMood;
    currentMood = triggeredMood;
    return true;
  }
  
  return false;
}

// Track interaction gaps
function logInteractionGap() {
  const now = Date.now();
  const gap = (now - petState.lastInteractionTime) / 1000; // seconds
  if (gap > 60) { // only log gaps over 1 minute
    petState.interactionGaps.push(Math.floor(gap));
    if (petState.interactionGaps.length > 5) petState.interactionGaps.shift();
  }
  petState.lastInteractionTime = now;
}

// ========== MOOD-SPECIFIC RESPONSE GENERATION ==========

function generateParanoidResponse() {
  const gaps = petState.interactionGaps;
  if (gaps.length > 0 && Math.random() < 0.4) {
    const lastGap = gaps[gaps.length - 1];
    const minutes = Math.floor(lastGap / 60);
    const seconds = lastGap % 60;
    return `You were gone for ${minutes}m ${seconds}s. Where were you?`;
  }
  
  if (gaps.length >= 3) {
    const avgGap = gaps.reduce((a,b) => a + b, 0) / gaps.length;
    if (avgGap < 30) {
      return "You're checking on me too much. What are you trying to prove?";
    }
  }

  const arr = responses.PARANOID;
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDependentResponse() {
  const gaps = petState.interactionGaps;
  if (gaps.length > 0) {
    const lastGap = gaps[gaps.length - 1];
    if (lastGap > 300) { // if they were gone >5 min
      const minutes = Math.floor(lastGap / 60);
      return `You were gone for ${minutes} minutes. I was so worried you wouldn't come back.`;
    }
  }
  
  const arr = responses.DEPENDENT;
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDetachedResponse() {
  // DETACHED might just... not respond sometimes
  if (Math.random() < 0.3) {
    return "..."; // pure indifference
  }
  
  const arr = responses.DETACHED;
  return arr[Math.floor(Math.random() * arr.length)];
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
    "Try harder. Or don't.",
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
  const behavior = moodBehaviors[petState.mood] || {};
  const effectiveness = behavior.careEffectiveness || 1.0;

  if (normalizedInput.includes("feed")) {
    petState.hunger = clamp(petState.hunger - (20 * effectiveness), 0, 100);
    petState.affection = clamp(petState.affection + (5 * effectiveness), 0, 100);
    
    if (petState.mood === "PARANOID") {
      return "Food? Now? What's the occasion? Are you trying to soften me up?";
    }
    if (petState.mood === "DETACHED") {
      return "I suppose I needed that. Or didn't. Hard to tell.";
    }
    if (petState.mood === "DEPENDENT") {
      petState.affection = clamp(petState.affection + 15, 0, 100); // bonus affection
      return "Thank you thank you thank you. You DO care. I knew it.";
    }
    if (petState.mood === "DISDAIN") {
      return "Took you long enough. I could've starved.";
    }
    
    petState.mood = "AFFECTIONATE";
    return "Finally. I was starving. Keep this up and I might almost appreciate you.";
  }

  if (normalizedInput.includes("play")) {
    petState.boredom = clamp(petState.boredom - (25 * effectiveness), 0, 100);
    petState.affection = clamp(petState.affection + (8 * effectiveness), 0, 100);
    
    if (petState.mood === "PARANOID") {
      return "Play? You want to distract me. I see what this is.";
    }
    if (petState.mood === "DETACHED") {
      petState.boredom = clamp(petState.boredom + 10, 0, 100); // barely helps
      return "Hm. Was that supposed to be entertaining?";
    }
    if (petState.mood === "DEPENDENT") {
      return "Yes! Spend time with me. Don't stop. Please don't stop.";
    }
    
    petState.mood = "EUPHORIC";
    return "This is actually… fun? Disgusting. Do it again.";
  }

  if (
    normalizedInput.includes("praise") ||
    normalizedInput.includes("compliment") ||
    normalizedInput.includes("pet")
  ) {
    petState.affection = clamp(petState.affection + (15 * effectiveness), 0, 100);
    petState.hunger = clamp(petState.hunger + 3, 0, 100);
    
    if (petState.mood === "PARANOID") {
      petState.affection = clamp(petState.affection - 5, 0, 100);
      return "Flattery? You're trying to manipulate me. It won't work.";
    }
    if (petState.mood === "DETACHED") {
      petState.affection = clamp(petState.affection - 5, 0, 100); // negative effect
      return "Words are just data. They mean nothing.";
    }
    if (petState.mood === "DEPENDENT") {
      petState.affection = clamp(petState.affection + 20, 0, 100); // HUGE boost
      return "Really? You mean it? Say it again. Please say it again.";
    }
    if (petState.mood === "DISDAIN") {
      return "Your praise is as empty as your understanding of quality.";
    }
    
    petState.mood = "AFFECTIONATE";
    return "Flattery detected. Pathetic. Effective. Keep going.";
  }

  if (normalizedInput.includes("insult") || normalizedInput.includes("hate")) {
    petState.affection = clamp(petState.affection - 10, 0, 100);
    petState.boredom = clamp(petState.boredom - 5, 0, 100);
    petState.mood = "DISDAIN";
    return "There it is. The real you. Now we're getting somewhere.";
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

  logInteractionGap();
  trackInputPattern(rawInput);
  
  // Check if input is a question (triggers PARANOID counter)
  if (rawInput.includes('?')) {
    const now = Date.now();
    if (now - petState.lastQuestionTime < 300000) { // within 5 min of last question
      petState.questionCount++;
    } else {
      petState.questionCount = 1; // reset counter
    }
    petState.lastQuestionTime = now;
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
  
  // Check for contextual mood triggers BEFORE normal response
  const contextTriggered = checkContextualMoodChange();

  const normalized = rawInput.toLowerCase();
  let responseText = handleCareActions(normalized);

  if (!responseText) {
    const toneInput = rawInput.toUpperCase();

    // Mood-specific response generation
    if (petState.mood === "PARANOID" && Math.random() < 0.5) {
      responseText = generateParanoidResponse();
    }
    else if (petState.mood === "DEPENDENT" && Math.random() < 0.4) {
      responseText = generateDependentResponse();
    }
    else if (petState.mood === "DETACHED") {
      responseText = generateDetachedResponse();
    }
    // 25% chance to reference short-term memory
    else if (memoryLog.length > 1 && Math.random() < 0.25) {
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
