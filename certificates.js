const form = document.getElementById("certificateForm");
const list = document.getElementById("certificateList");
const statusText = document.getElementById("certificateStatus");
const exportButton = document.getElementById("exportCertificates");
const resetButton = document.getElementById("resetCertificates");

let certificates = [];

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#ffb0b0" : "";
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function renderCertificates() {
  if (!certificates.length) {
    list.innerHTML = '<p class="muted">No certificates yet. Add one above.</p>';
    return;
  }

  list.innerHTML = certificates
    .map(
      (item, index) => `
        <article class="cert-item reveal-up">
          <h3>${item.title}</h3>
          <p><strong>Issuer:</strong> ${item.issuer}</p>
          <p><strong>Date:</strong> ${item.date}</p>
          ${item.url ? `<p><a class="btn" href="${item.url}" target="_blank" rel="noreferrer">Verify</a></p>` : ""}
          <button class="btn" data-index="${index}">Remove</button>
        </article>
      `
    )
    .join("");
}

async function loadCertificatesFromFile() {
  setStatus("Loading certificates from data/certificates.json...");

  try {
    const response = await fetch("data/certificates.json", { cache: "no-store" });
    const data = await response.json();

    if (!response.ok || !Array.isArray(data)) {
      throw new Error("Invalid certificates.json format.");
    }

    certificates = data;
    renderCertificates();
    setStatus(`Loaded ${certificates.length} certificate${certificates.length === 1 ? "" : "s"}.`);
  } catch (error) {
    certificates = [];
    renderCertificates();
    setStatus(`Could not load certificates: ${error.message}`, true);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());

  certificates.unshift(values);
  form.reset();
  renderCertificates();
  setStatus("Certificate added in-memory. Download certificates.json to save changes.");
});

list.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const index = Number(target.dataset.index);

  if (Number.isNaN(index)) {
    return;
  }

  certificates.splice(index, 1);
  renderCertificates();
  setStatus("Certificate removed in-memory. Download certificates.json to save changes.");
});

exportButton.addEventListener("click", () => {
  downloadJson("certificates.json", certificates);
  setStatus("Downloaded certificates.json. Replace data/certificates.json with this file.");
});

resetButton.addEventListener("click", loadCertificatesFromFile);

loadCertificatesFromFile();
