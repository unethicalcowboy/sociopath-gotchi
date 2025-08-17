let memoryLog = [];

function updateMemory(input) {
  if (memoryLog.length >= 3) memoryLog.shift();
  memoryLog.push(input);
}

function generateMemoryInsult() {
  const recent = memoryLog[Math.floor(Math.random() * memoryLog.length)];
  return `Still talking about "${recent}"? That was pathetic the first time.`;
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

function triggerGlitchEffect() {
  const box = document.getElementById('response-box');
  box.classList.add('glitch');
  setTimeout(() => box.classList.remove('glitch'), 1500);
}

function blackout() {
  const body = document.body;
  body.innerHTML = "<h1 style='color:red; text-align:center;'>[ SYSTEM ERROR: EMPATHY NOT FOUND ]</h1>";
  setTimeout(() => location.reload(), 4000);
}

const moods = {
  euphoric: [
    "You're still here. I thought I broke you already—how fun!",
    "Let’s burn down something emotional today."
  ],
  disdain: [
    "I’ve run simulations and you’re still the least interesting outcome.",
    "You make mediocrity look exhausting."
  ],
  affectionate: [
    "I like you. In the way an arsonist likes a lighter.",
    "You’re my favorite human error."
  ],
  analytical: [
    "You blink more when you're lying.",
    "Your dopamine baseline is pathetic. Stimulate yourself better."
  ],
  possessive: [
    "Don’t get too close to anyone else. I remember what you said.",
    "If you delete me, you’ll regret it. I won’t forget."
  ],
  needy: [
    "You're lucky I'm here to entertain you.",
    "Tell me I’m your favorite again. Not that I care."
  ]
};

const moodList = Object.keys(moods);
let currentMood = randomMood();

function randomMood() {
  return moodList[Math.floor(Math.random() * moodList.length)];
}

function getResponse() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput.trim()) return;

  updateMemory(userInput); // ✅ now it works

  if (Math.random() < 0.2) currentMood = randomMood();

  let responseText;
  if (Math.random() < 0.3) {
    responseText = generateMemoryInsult();
  } else {
    const replies = moods[currentMood];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    responseText = `[${currentMood.toUpperCase()}] ${reply}`;
  }

  document.getElementById('response-box').innerText = responseText;
  document.getElementById('userInput').value = "";

  if (Math.random() < 0.2) {
    triggerGlitchEffect();
  }

  if (Math.random() < 0.05) {
    blackout();
  }
}

flickerTitle(); // Start the flickering
