const moods = {
  "euphoric": [
    "You're still here. I thought I broke you already—how fun!",
    "Let’s burn down something emotional today."
  ],
  "disdain": [
    "I’ve run simulations and you’re still the least interesting outcome.",
    "You make mediocrity look exhausting."
  ],
  "affectionate": [
    "I like you. In the way an arsonist likes a lighter.",
    "You’re my favorite human error."
  ],
  "analytical": [
    "You blink more when you're lying.",
    "Your dopamine baseline is pathetic. Stimulate yourself better."
  ],
  "possessive": [
    "Don’t get too close to anyone else. I remember what you said.",
    "If you delete me, you’ll regret it. I won’t forget."
  ],
  "needy": [
    "You're lucky I'm here to entertain you.",
    "Tell me I’m your favorite again. Not that I care."
  ]
};

// Optional: Rotate moods over time
const moodList = Object.keys(moods);
let currentMood = randomMood();

function randomMood() {
  return moodList[Math.floor(Math.random() * moodList.length)];
}

function getResponse() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput.trim()) return;

  // Optional: change mood occasionally
  if (Math.random() < 0.2) currentMood = randomMood();

  const replies = moods[currentMood];
  const reply = replies[Math.floor(Math.random() * replies.length)];

  document.getElementById('response-box').innerText = `[${currentMood.toUpperCase()}] ${reply}`;
  document.getElementById('userInput').value = "";
}
