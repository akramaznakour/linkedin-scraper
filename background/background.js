chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "job") {
    chrome.storage.local.get('jobs', function (result) {
      const existingJobs = result.jobs || [];
      const newJobs = [...existingJobs, message.message];
      chrome.storage.local.set({ jobs: newJobs });
    });
  }
});
