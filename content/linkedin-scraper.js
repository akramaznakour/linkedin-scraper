// send scrapped job
function sendJob(job) {
  chrome.runtime.sendMessage({ action: "job", message: job });
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage({ action: "popupMessage", message: message });
}

function sendProgressPercentage(progressPercentage) {
  chrome.runtime.sendMessage({
    action: "progressPercentage",
    message: progressPercentage,
  });
}

function simulateRealScrollToEnd(element, duration) {
  const startScrollTop = element.scrollTop;
  const endScrollTop = element.scrollHeight - element.clientHeight;

  const startTime = performance.now();
  const endTime = startTime + duration;

  function scrollStep(timestamp) {
    const currentTime = Math.min(timestamp, endTime);
    const elapsedTime = currentTime - startTime;
    const scrollFraction = elapsedTime / duration;
    const scrollTop =
      startScrollTop + (endScrollTop - startScrollTop) * scrollFraction;

    element.scrollTop = scrollTop;

    if (currentTime < endTime) {
      window.requestAnimationFrame(scrollStep);
    }
  }

  window.requestAnimationFrame(scrollStep);
}

async function scrapeJobDetails(card) {
  card.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const jobTitle = document.querySelector(
    ".jobs-unified-top-card__job-title"
  ).innerText;
  const jobInsight =
    document.querySelector(".jobs-unified-top-card__bullet")?.innerText || "";
  const jobDescription = document.querySelector(
    ".jobs-description-content__text"
  ).innerText;
  const linkedinJobId = window.location.href
    .split("currentJobId=")[1]
    .split("&")[0];
  const link = `https://www.linkedin.com/jobs/search/?currentJobId=${linkedinJobId}`;

  return {
    linkedinJobId,
    link,
    jobTitle,
    jobInsight,
    jobDescription,
  };
}

async function scrapeJobsPage() {
  const jobs = [];

  const cards = document.querySelectorAll(".job-card-container");
  const cardCount = cards.length;
  sendMessageToPopup(`Card Count: ${cardCount}`);

  for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
    sendMessageToPopup(`Card ${cardIndex + 1}`);
    const jobDetails = await scrapeJobDetails(cards[cardIndex]);
    sendJob(jobDetails);
    jobs.push(jobDetails);
  }

  return jobs;
}

async function scrapeLinkedInJobs() {
  const jobs = [];
  const pageCountElements = [
    ...document.querySelectorAll(".artdeco-pagination__indicator"),
  ];
  const pageCount =
    pageCountElements.length > 0
      ? parseInt(
          pageCountElements[pageCountElements.length - 1].textContent.trim()
        )
      : 1;

  sendMessageToPopup(`Page Count: ${pageCount}`);

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    sendProgressPercentage(((pageIndex + 1) / pageCount) * 100);

    if (pageCount > 1) {
      document
        .querySelectorAll(".artdeco-pagination__indicator")
        [pageIndex].querySelector("button")
        .click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    sendMessageToPopup(`Page ${pageIndex + 1}`);

    const cardsListElement = document.querySelector(
      ".jobs-search-results-list"
    );

    await simulateRealScrollToEnd(cardsListElement, 500);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pageJobs = await scrapeJobsPage();
    jobs.push(...pageJobs);
  }

  return jobs;
}
