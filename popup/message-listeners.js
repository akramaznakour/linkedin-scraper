chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action !== "scrapedData") {
    return;
  }

  const jobs = message.data;

  const csv = generateCSV(jobs);

  const sql = generateSQL(jobs);

  const startButton = document.getElementById("startButton");
  const copyCsvButton = document.getElementById("copyCsvButton");
  const downloadCsvButton = document.getElementById("downloadCsvButton");
  const copySqlButton = document.getElementById("copySqlButton");
  const downloadSqlButton = document.getElementById("downloadSqlButton");

  // Enable the buttons
  startButton.disabled = false;
  enableButtons(copyCsvButton);
  enableButtons(downloadCsvButton);
  enableButtons(copySqlButton);
  enableButtons(downloadSqlButton);

  // Add event listeners to the buttons
  copyCsvButton.addEventListener("click", function () {
    copyToClipboard(csv);
  });

  downloadCsvButton.addEventListener("click", function () {
    downloadFile(csv, "jobs.csv");
  });

  copySqlButton.addEventListener("click", function () {
    copyToClipboard(sql);
  });

  downloadSqlButton.addEventListener("click", function () {
    downloadFile(sql, "jobs.sql");
  });
});

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
