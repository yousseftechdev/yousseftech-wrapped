const list = document.getElementById("certificateList");
const statusText = document.getElementById("certificateStatus");

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#ffb0b0" : "";
}

function certificateCard(item) {
  return `
    <article class="cert-item reveal-up">
      ${item.image ? `<p><img class="cert-image" src="../data/images/certificates/${item.image}" alt="${item.title}"></p>` : ""}
      <h3>${item.title}</h3>
      <p><strong>Issuer:</strong> ${item.issuer}</p>
      <p><strong>Date:</strong> ${item.date}</p>
      ${item.code ? `<p><strong>Certificate verification code:</strong> ${item.code}</p>` : ""}
      ${item.url ? `<p><a class="btn" href="${item.url}" target="_blank" rel="noreferrer">Verify</a></p>` : ""}
    </article>
  `;
}

async function renderCertificates() {
  setStatus("Loading certificates...");

  try {
    const response = await fetch("../data/json/certificates.json");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to load certificates.");
    }

    if (!data.length) {
      list.innerHTML = '<p class="muted">No certificates available.</p>';
      setStatus("No certificates found.");
      return;
    }

    list.innerHTML = data.map(certificateCard).join("");
    setStatus(`Loaded ${data.length} certificate${data.length === 1 ? "" : "s"}.`);
  } catch (error) {
    list.innerHTML = "";
    setStatus(`Could not load certificates: ${error.message}`, true);
  }
}

renderCertificates();
