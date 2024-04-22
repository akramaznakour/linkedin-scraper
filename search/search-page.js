document.addEventListener("DOMContentLoaded", function () {
  let table;

  initializeDataTable();

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "local" && changes.jobs) {
      loadJobsTable();
    }
  });

  function initializeDataTable() {
    table = $("#jobsTable").DataTable({
      paging: false,
      searching: true,
      info: true,
    });

    loadJobsTable();
  }

  function loadJobsTable() {
    chrome.storage.local.get("jobs", function (result) {
      const jobs = result.jobs;

      console.log(jobs);

      if (jobs && jobs.length > 0) {
        // Clear existing table rows
        const tableBody = document.getElementById("jobsTableBody");
        table.clear().draw();

        // Create table rows from the jobs data
        jobs.forEach(function (job) {
          table.row
            .add([
              job.jobTitle,
              job.jobLocation,
              job.company,
              job.postedSince,
              job.numberOfApplicants,
              `<a href="${job.link}">link</a>`,
              job.jobDescription,
            ])
            .draw();
        });

        // Update the title with the count of jobs
        document.getElementById(
          "pageTitle"
        ).innerText = `LinkedIn Job (${jobs.length})`;
      }
    });
  }
});

document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    chrome.storage.local.remove("jobs", function () {
      // Handle the removal of "jobs" from chrome.storage.local
      console.log("Jobs data removed from chrome.storage.local");
      location.reload(); // Reload the page
    });
  });
