const status = document.getElementById("status");

function interact() {
  const responses = [
    "It stares blankly. You feel uneasy.",
    "It twitches. Maybe don’t do that again.",
    "Its smile doesn't reach its eyes.",
    "It logs your click. Why?",
    "It says nothing. But it *knows*."
  ];

  const index = Math.floor(Math.random() * responses.length);
  status.textContent = responses[index];
}
