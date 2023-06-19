chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "popupMessage") {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = message.message + "...";
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "progressPercentage") {
    const progressBar = document.getElementById("progressBar");

    // Check if the element is hidden
    if (getComputedStyle(progressBar).display === "none") {
      progressBar.style.display = "block"; // Display the element
    }

    progressBar.value = message.message;
    progressBar.textContent = message.message + "%";
  }
});

