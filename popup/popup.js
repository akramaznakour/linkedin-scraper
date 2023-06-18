document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startButton").disabled = true;
  document.getElementById("progressBar").style.display = "block";
  document.getElementById("progressBar").value = 0;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { action: "startScraping" });
  });
});

document
  .getElementById("openSearchPageButton")
  .addEventListener("click", () => {
    var pageURL = chrome.runtime.getURL("search/search-page.html");
    chrome.tabs.create({ url: pageURL });
  });

chrome.storage.local.get("jobs", function (result) {
  const jobs = result.jobs || [];
  const jobsCount = jobs.length;
  document.getElementById("searchCount").innerText = "(" + jobsCount + ")";
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "local" && changes.jobs) {
    const newJobs = changes.jobs.newValue || [];
    const jobsCount = newJobs.length;
    document.getElementById("searchCount").innerText = "(" + jobsCount + ")";
  }
});
