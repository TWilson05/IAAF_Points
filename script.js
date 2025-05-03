const timeInput = document.getElementById("timeInput");
const eventSelect = document.getElementById("eventSelect");
const resultBox = document.getElementById("resultBox");

function computePoints(event, time) {
  if (!event || isNaN(time)) return "Invalid input.";

  // Dummy formula for example
  if (event === "100m") return (25 - time) * 10;
  if (event === "longJump") return (time * 30);
  if (event === "highJump") return (time * 40);
  return "Event not recognized.";
}

function updateResult() {
  const time = parseFloat(timeInput.value);
  const event = eventSelect.value;
  const points = computePoints(event, time);
  resultBox.textContent = `Points: ${points}`;
}

timeInput.addEventListener("input", updateResult);
eventSelect.addEventListener("change", updateResult);
