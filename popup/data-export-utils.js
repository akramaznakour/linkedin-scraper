function enableButtons(button) {
  button.disabled = false;
  button.classList.remove("disabled-data-export-button");
  button.classList.add("enabled-data-export-button");
}

function escapeCSVValue(value) {
  if (
    typeof value === "string" &&
    (value.includes(",") || value.includes('"'))
  ) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function escapeSQLValue(value) {
  if (typeof value === "string") {
    return "'" + value.replace(/'/g, "''") + "'";
  } else if (typeof value === "number") {
    return value;
  } else if (value instanceof Date) {
    return "'" + value.toISOString().split("T")[0] + "'";
  } else {
    return "NULL";
  }
}

function generateCSV(jobs) {
  const header = Object.keys(jobs[0]).map(escapeCSVValue).join(",");
  const rows = jobs.map((job) =>
    Object.values(job).map(escapeCSVValue).join(",")
  );
  return header + "\n" + rows.join("\n");
}

function generateSQL(jobs) {
  const date = new Date().toISOString().split("T")[0];

  const sql = `
    CREATE TABLE IF NOT EXISTS jobs (
        id INT NOT NULL AUTO_INCREMENT,
        linkedinJobId VARCHAR(255) NOT NULL,
        link VARCHAR(255) NOT NULL,
        jobTitle VARCHAR(255) NOT NULL,
        jobInsight VARCHAR(255) NOT NULL,
        jobDescription TEXT NOT NULL,
        date DATE NOT NULL,
        PRIMARY KEY (id)
    );
    
    INSERT INTO jobs (linkedinJobId, link, jobTitle, jobInsight, jobDescription, date)
    VALUES ${jobs
      .map(
        (job) =>
          `(${escapeSQLValue(job.linkedinJobId)}, ${escapeSQLValue(
            job.link
          )}, ${escapeSQLValue(job.jobTitle)}, ${escapeSQLValue(
            job.jobInsight
          )}, ${escapeSQLValue(job.jobDescription)}, ${escapeSQLValue(date)})`
      )
      .join(",\n")};
      `;

  return sql;
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
}


function downloadFile(content, filename) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
