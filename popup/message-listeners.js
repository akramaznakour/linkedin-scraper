chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "popupMessage") {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = message.message + "...";
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "progressPercentage") {
    const progressBar = document.getElementById("progressBar");
    progressBar.value = message.message;
    progressBar.textContent = message.message + "%";
  }
});
