document.addEventListener("DOMContentLoaded", () => {
    const timeInput = document.getElementById("timeInput");
    const eventSelect = document.getElementById("eventSelect");
    const genderSelect = document.getElementById("genderSelect");
    const resultBox = document.getElementById("resultBox");

    let fullData = {};

    // Load JSON
    fetch("2025_lookup_table.json")
        .then(res => res.json())
        .then(data => {
            fullData = data;
            populateEvents(genderSelect.value);
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
            return parts[0];
        } else if (parts.length === 2) {
            const [minutes, seconds] = parts;
            return minutes * 60 + seconds;
        } else if (parts.length === 3) {
            const [hours, minutes, seconds] = parts;
            return hours * 3600 + minutes * 60 + seconds;
        } else {
            return NaN;
        }
    }

    function lookupPoints(timesList, inputTime) {
        for (let i = 0; i < timesList.length; i++) {
            if (inputTime <= timesList[i]) {
                // Map index 0 → 1400 points, index 1 → 1399, etc.
                return 1400 - i;
            }
        }
        return 0; // slower than last value
    }

    function updateResult() {
        const x = convertTimeToSeconds(timeInput.value);
        const gender = genderSelect.value;
        const event = eventSelect.value;

        if (!event || isNaN(x)) {
            resultBox.textContent = "Please enter valid time and select an event.";
            return;
        }

        const timesList = fullData[gender][event];
        const points = lookupPoints(timesList, x);
        resultBox.textContent = `Points: ${points}`;
    }

    timeInput.addEventListener("input", updateResult);
    eventSelect.addEventListener("change", updateResult);
    genderSelect.addEventListener("change", () => {
        populateEvents(genderSelect.value);
        resultBox.textContent = "Result will appear here.";
    });
});
