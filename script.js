// === Guided Breathing Timer ===
const breathText = document.querySelector(".breath-circle__text");
const circle = document.querySelector(".breath-circle");
const timerButtons = document.querySelectorAll(".timer-controls__btn");
const journalInput = document.getElementById("gratitude-input");

let interval,
  totalTime = 0;

function startBreathing(durationInMinutes) {
  clearInterval(interval);
  totalTime = durationInMinutes * 60 * 1000;
  const cycleTime = 19000; // 4s inhale + 7s hold + 8s exhale
  const startTime = Date.now();

  function runBreathCycle() {
    breathText.textContent = "Inhale";
    circle.style.transform = "scale(1.3)";

    setTimeout(() => {
      breathText.textContent = "Hold";
      circle.style.transform = "scale(1.3)";
    }, 4000);

    setTimeout(() => {
      breathText.textContent = "Exhale";
      circle.style.transform = "scale(1)";
    }, 11000);
  }

  runBreathCycle();

  interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= totalTime) {
      clearInterval(interval);
      breathText.textContent = "Done";
      circle.style.transform = "scale(1)";
    } else {
      runBreathCycle();
    }
  }, cycleTime);
}

// Attach event listeners to timer buttons
timerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const minutes = parseInt(btn.dataset.duration);
    startBreathing(minutes);
  });
});

// === Gratitude Journal (Save / Clear with messages) ===

const saveBtn = document.getElementById("save-entry");
const resetBtn = document.getElementById("reset-entry");
const saveMessage = document.getElementById("save-message");
const clearMessage = document.getElementById("clear-message");

// Load saved journal entry OR keep placeholder if empty
const savedEntry = localStorage.getItem("gratitude");
if (savedEntry) {
  journalInput.value = savedEntry;
} else {
  journalInput.value = ""; // Ensure field is truly empty so placeholder shows
}

saveBtn.addEventListener("click", () => {
  localStorage.setItem("gratitude", journalInput.value);
  saveMessage.textContent = "Journal saved!";
  saveMessage.style.opacity = "1";

  setTimeout(() => {
    saveMessage.style.opacity = "0";
  }, 3000);
});

resetBtn.addEventListener("click", () => {
  journalInput.value = "";
  localStorage.removeItem("gratitude");
  clearMessage.textContent = "Journal cleared.";
  clearMessage.style.opacity = "1";

  setTimeout(() => {
    clearMessage.style.opacity = "0";
  }, 3000);
});

const rainButton = document.querySelector('[data-sound="rain"]');
const videoPopup = document.getElementById("rainPopup");
const closePopupButton = document.getElementById("closePopup");

rainButton.addEventListener("click", () => {
  openPopup();
});

closePopupButton.addEventListener("click", closePopup);

// Close when clicking outside the video
videoPopup.addEventListener("click", (event) => {
  if (event.target === videoPopup) {
    closePopup();
  }
});

// Also handle ESC key to exit
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePopup();
  }
});

let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("rainVideo", {
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  // Player is ready
}

// Modify your existing openPopup function
function openPopup() {
  document.getElementById("rainPopup").style.display = "flex";
  if (player) {
    player.playVideo();
    const iframe = document.getElementById("rainVideo");
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    }
  }
}

// Modify your existing closePopup function
function closePopup() {
  document.getElementById("rainPopup").style.display = "none";
  if (player) {
    player.stopVideo();
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
  }
}
