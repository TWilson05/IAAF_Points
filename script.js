document.addEventListener("DOMContentLoaded", () => {
    const timeInput = document.getElementById("timeInput");
    const eventSelect = document.getElementById("eventSelect");
    const genderSelect = document.getElementById("genderSelect");
    const windInput = document.getElementById("windInput");
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
        if (!timesList || timesList.length === 0) return 0;

        // Detect order
        const ascending = timesList[0] < timesList[timesList.length - 1];

        if (ascending) {
            // Smaller time = more points
            for (let i = 0; i < timesList.length; i++) {
                if (inputTime <= timesList[i]) {
                    return 1400 - i;
                }
            }
        } else {
            // Larger time = more points (rare, but handle just in case)
            for (let i = 0; i < timesList.length; i++) {
                if (inputTime >= timesList[i]) {
                    return 1400 - i;
                }
            }
        }

        return 0; // Slower than the last value
    }

    function adjustForWind(points, windStr) {
        // If user leaves blank → no adjustment
        if (!windStr.trim()) {
            return points;
        }

        // Handle NWI (No Wind Info) case
        if (windStr.trim().toUpperCase() === "NWI") {
            return points - 30; // Deduct 30 points
        }

        const wind = parseFloat(windStr);
        if (isNaN(wind)) {
            // Invalid input → no adjustment
            return points;
        }

        const pointsPerMs = 6;

        if (wind < 0) {
            // Headwind: add points
            return points + (Math.abs(wind) * pointsPerMs);
        } else if (wind <= 2.0) {
            // Tailwind up to +2.0 m/s: no change
            return points;
        } else {
            // Tailwind > +2.0 m/s: deduct points (starting from 0.0 m/s)
            return points - (wind * pointsPerMs);
        }
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
        let points = lookupPoints(timesList, x);   // Base points from table
        points = adjustForWind(points, windInput.value); // Apply wind adjustment

        resultBox.textContent = `Points: ${Math.round(points)}`;
    }

    timeInput.addEventListener("input", updateResult);
    eventSelect.addEventListener("change", updateResult);
    windInput.addEventListener("input", updateResult);
    genderSelect.addEventListener("change", () => {
        populateEvents(genderSelect.value);
        resultBox.textContent = "Result will appear here.";
    });
});
