document.addEventListener("DOMContentLoaded", () => {
    const timeInput = document.getElementById("timeInput");
    const eventSelect = document.getElementById("eventSelect");
    const genderSelect = document.getElementById("genderSelect");
    const resultBox = document.getElementById("resultBox");
  
    let fullData = {};
  
    // Load JSON
    fetch("2025_fit_params.json")
      .then(res => res.json())
      .then(data => {
        fullData = data;
        populateEvents(genderSelect.value);  // Initial population
      })
      .catch(err => {
        console.error("Failed to load JSON:", err);
      });
  
    function populateEvents(gender) {
      const events = fullData[gender];
      if (!events) return;
  
      eventSelect.innerHTML = "<option value=''>-- Choose an Event --</option>";
      for (const event in events) {
        const opt = document.createElement("option");
        opt.value = event;
        opt.textContent = event;
        eventSelect.appendChild(opt);
      }
    }
  
    function computePoints(a, b, c, x) {
      return a + b * x + c * x * x;
    }
  
    function updateResult() {
      const x = parseFloat(timeInput.value);
      const gender = genderSelect.value;
      const event = eventSelect.value;
  
      if (!event || isNaN(x)) {
        resultBox.textContent = "Please enter valid time and select an event.";
        return;
      }
  
      const [a, b, c] = fullData[gender][event];
      const points = computePoints(a, b, c, x);
      resultBox.textContent = `Points: ${Math.round(points)}`;
    }
  
    timeInput.addEventListener("input", updateResult);
    eventSelect.addEventListener("change", updateResult);
    genderSelect.addEventListener("change", () => {
      populateEvents(genderSelect.value);
      resultBox.textContent = "Result will appear here."; // Reset result
    });
  });
  