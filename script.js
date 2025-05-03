const timeInput = document.getElementById("timeInput");
const eventSelect = document.getElementById("eventSelect");
const genderSelect = document.getElementById("genderSelect");
const resultBox = document.getElementById("resultBox");

function computePoints(event, time, gender) {
  if (!event || isNaN(time) || !gender) return "Invalid input.";

  // Dummy logic: adjust points slightly based on gender
  let basePoints;
  if (event === "100m") basePoints = (25 - time) * 10;
  else if (event === "longJump") basePoints = time * 30;
  else if (event === "highJump") basePoints = time * 40;
  else return "Event not recognized.";

  // Example gender adjustment: female gets 5% more
  if (gender === "female") basePoints *= 1.05;

  return Math.round(basePoints);
}

function updateResult() {
  const time = parseFloat(timeInput.value);
  const event = eventSelect.value;
  const gender = genderSelect.value;
  const points = computePoints(event, time, gender);
  resultBox.textContent = `Points: ${points}`;
}

timeInput.addEventListener("input", updateResult);
eventSelect.addEventListener("change", updateResult);
genderSelect.addEventListener("change", updateResult);
