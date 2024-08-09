let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isWorkTime = true;
const totalTime = 25 * 60; // Total time for full circle

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Update circular progress
  const progress = (totalTime - timeLeft) / totalTime;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference * (1 - progress);
  const progressCircle = document.querySelector('.timer-progress');
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = offset;

  // Change color based on progress
  const hue = (1 - progress) * 120; // 120 for green, transitions to 0 for red
  progressCircle.style.stroke = `hsl(${hue}, 80%, 45%)`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft === 0) {
        clearInterval(timer);
        isRunning = false;
        if (isWorkTime) {
          timeLeft = 5 * 60; // 5 minute break
          totalTime = 5 * 60;
          isWorkTime = false;
          document.getElementById('status').textContent = "Break time!";
        } else {
          timeLeft = 25 * 60; // Back to 25 minute work session
          totalTime = 25 * 60;
          isWorkTime = true;
          document.getElementById('status').textContent = "Work time!";
        }
        updateDisplay();
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL("icons/icon-48.png"),
          "title": "Pomodoro Timer",
          "message": isWorkTime ? "Break's over! Time to focus." : "Good job! Take a break."
        });
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  totalTime = 25 * 60;
  isWorkTime = true;
  updateDisplay();
  document.getElementById('status').textContent = "Ready to focus!";
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

updateDisplay();