const form = document.getElementById("certificateForm");
const list = document.getElementById("certificateList");
const statusText = document.getElementById("certificateStatus");

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#ffb0b0" : "";
}

function certificateCard(item) {
  return `
    <article class="cert-item reveal-up">
      <h3>${item.title}</h3>
      <p><strong>Issuer:</strong> ${item.issuer}</p>
      <p><strong>Date:</strong> ${item.date}</p>
      ${item.url ? `<p><a class="btn" href="${item.url}" target="_blank" rel="noreferrer">Verify</a></p>` : ""}
      <button class="btn" data-id="${item.id}">Remove</button>
    </article>
  `;
}

async function renderCertificates() {
  setStatus("Loading certificates from Supabase...");

  try {
    const response = await fetch("/api/certificates");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Failed to load certificates.");
    }

    const data = payload.data || [];

    if (!data.length) {
      list.innerHTML = '<p class="muted">No certificates yet. Add your first one above.</p>';
      setStatus("Connected to Supabase. Ready for your first certificate.");
      return;
    }

    list.innerHTML = data.map(certificateCard).join("");
    setStatus(`Loaded ${data.length} certificate${data.length === 1 ? "" : "s"} from Supabase.`);
  } catch (error) {
    list.innerHTML = "";
    setStatus(`Could not load certificates: ${error.message}`, true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());

  setStatus("Saving certificate...");

  try {
    const response = await fetch("/api/certificates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Failed to save certificate.");
    }

    form.reset();
    await renderCertificates();
  } catch (error) {
    setStatus(`Could not save certificate: ${error.message}`, true);
  }
});

list.addEventListener("click", async (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = target.dataset.id;

  if (!id) {
    return;
  }

  setStatus("Removing certificate...");

  try {
    const response = await fetch(`/api/certificates?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Failed to remove certificate.");
    }

    await renderCertificates();
  } catch (error) {
    setStatus(`Could not remove certificate: ${error.message}`, true);
  }
});

renderCertificates();
