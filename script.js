let timer;
let isRunning = false;
const numCycles = 4; // Number of cycles to repeat
let workDuration = 25 * 60; // Initial work duration in seconds (25 minutes)
let breakDuration = 5 * 60; // Initial break duration in seconds (5 minutes)

// Function to play the bell sound
function playBellSound() {
    document.getElementById('audio').play();
}

// Function to start the timer
function startTimer(duration, display, onFinish) {
    isRunning = true;
    let start = Date.now();

    function timerFunction() {
        if (!isRunning) return;

        let diff = duration - (((Date.now() - start) / 1000) | 0);

        let minutes = Math.floor(diff / 60);
        let seconds = Math.floor(diff % 60);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            clearInterval(timer);
            isRunning = false;
            display.textContent = "00:00";
            playBellSound(); // Play sound when the timer ends
            if (onFinish) onFinish();
        }
    }

    timerFunction();
    timer = setInterval(timerFunction, 1000);
}

// Function to update the progress bar
function updateProgressBar(currentCycle, totalCycles) {
    const progressBar = document.getElementById("progress-bar");
    const percentComplete = (currentCycle / totalCycles) * 100;
    progressBar.style.width = percentComplete + "%";
}

// Function to start the work timer
function startWorkTimer(display, cyclesLeft) {
    if (cyclesLeft === 0) return;

    updateProgressBar(numCycles - cyclesLeft, numCycles); // Update progress bar
    startTimer(workDuration, display, function () {
        display.textContent = "00:00";
        playBellSound(); // Play sound when work timer ends
        setTimeout(function () {
            startBreakTimer(display, cyclesLeft);
        }, 1000); // Delay before starting break timer
    });
}

// Function to start the break timer
function startBreakTimer(display, cyclesLeft) {
    if (cyclesLeft === 0) return;

    updateProgressBar(numCycles - cyclesLeft + 0.5, numCycles); // Update progress bar for break
    startTimer(breakDuration, display, function () {
        display.textContent = "00:00";
        playBellSound(); // Play sound when break timer ends
        setTimeout(function () {
            startWorkTimer(display, cyclesLeft - 1);
        }, 1000); // Delay before starting work timer
    });
}

// Function to update timer text
function updateTimerText(timerId, minutes) {
    const display = document.getElementById(timerId);
    const seconds = "00";
    display.textContent = minutes + ":" + seconds;
}

// Event listener for the start button
document.getElementById("start-btn").addEventListener("click", function () {
    if (!isRunning) {
        workDuration = parseInt(document.getElementById("work-timer-text").textContent.split(":")[0]) * 60;
        breakDuration = parseInt(document.getElementById("break-timer-text").textContent.split(":")[0]) * 60;
        const display = document.getElementById("main-timer-text");
        startWorkTimer(display, numCycles);
    }
});

// Event listener for the reset button
document.getElementById("reset-btn").addEventListener("click", function () {
    clearInterval(timer);
    isRunning = false;
    document.getElementById("main-timer-text").textContent = "25:00"; // Reset timer to default value
});

// Event listener for the stop button
document.getElementById("stop-btn").addEventListener("click", function () {
    clearInterval(timer);
    isRunning = false;
});

// Event listeners for arrow buttons (optional: if you want to allow manual adjustments)
document.getElementById("work-increase-btn").addEventListener("click", function () {
    let workTime = parseInt(document.getElementById("work-timer-text").textContent.split(":")[0]);
    if (workTime < 30) { // Maximum work time is 30 minutes
        workTime++;
        updateTimerText("work-timer-text", workTime);
    }
});

document.getElementById("work-decrease-btn").addEventListener("click", function () {
    let workTime = parseInt(document.getElementById("work-timer-text").textContent.split(":")[0]);
    if (workTime > 15) { // Minimum work time is 15 minutes
        workTime--;
        updateTimerText("work-timer-text", workTime);
    }
});

document.getElementById("break-increase-btn").addEventListener("click", function () {
    let breakTime = parseInt(document.getElementById("break-timer-text").textContent.split(":")[0]);
    if (breakTime < 30) { // Maximum break time is 30 minutes
        breakTime++;
        updateTimerText("break-timer-text", breakTime);
    }
});

document.getElementById("break-decrease-btn").addEventListener("click", function () {
    let breakTime = parseInt(document.getElementById("break-timer-text").textContent.split(":")[0]);
    if (breakTime > 3) { // Minimum break time is 3 minutes
        breakTime--;
        updateTimerText("break-timer-text", breakTime);
    }
});
