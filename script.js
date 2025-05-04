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

    function convertTimeToSeconds(timeStr) {
        if (!timeStr) return NaN;
        
        const parts = timeStr.split(":").map(parseFloat);
        if (parts.length === 1) {
            return parts[0]; // e.g., "12.34"
        } else if (parts.length === 2) {
            // mm:ss.ss
            const [minutes, seconds] = parts;
            return minutes * 60 + seconds;
        } else if (parts.length === 3) {
            // hh:mm:ss.ss
            const [hours, minutes, seconds] = parts;
            return hours * 3600 + minutes * 60 + seconds;
        } else {
            return NaN; // Invalid format
        }
    }
  
    function computePoints(a, b, c, x) {
      return a * Math.pow(x + b, 2) + c;
    }
  
    function updateResult() {
      const x = convertTimeToSeconds(timeInput.value);
      const gender = genderSelect.value;
      const event = eventSelect.value;
  
      if (!event || isNaN(x)) {
        resultBox.textContent = "Please enter valid time and select an event.";
        return;
      }
  
      const [a, b, c] = fullData[gender][event];
      const points = computePoints(a, b, c, x);
      resultBox.textContent = `Points: ${Math.floor(points)}`;
    }
  
    timeInput.addEventListener("input", updateResult);
    eventSelect.addEventListener("change", updateResult);
    genderSelect.addEventListener("change", () => {
      populateEvents(genderSelect.value);
      resultBox.textContent = "Result will appear here."; // Reset result
    });
  });
  