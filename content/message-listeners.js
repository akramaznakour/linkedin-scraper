chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startScraping") {
    scrapeLinkedInJobs()
      .then((data) => {})
      .catch((err) => {
        console.error(err);
      });
  }

  return true;
});
