chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "startScraping") {
      scrapeLinkedInJobs()
        .then((data) => {
          chrome.runtime.sendMessage({ action: "scrapedData", data: data });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });