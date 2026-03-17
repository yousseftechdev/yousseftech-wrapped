const quoteSection = document.getElementById("quoteSection");
const refreshQuoteBtn = document.getElementById("refreshQuoteBtn");

async function loadRandomQuote() {
  if (!quoteSection) return;

  try {
    const response = await fetch("https://thequoteshub.com/api/random-quote?format=json");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    quoteSection.innerHTML = `
      <div class="quote-box">
        <p class="quote-text">“${data.text}”</p>
        <p class="quote-author">— ${data.author || "Unknown"}</p>
      </div>
    `;
  } catch (error) {
    console.error("Failed to load quote:", error);

    quoteSection.innerHTML = `
      <div class="quote-box">
        <p class="quote-text">“Couldn’t load a quote right now.”</p>
        <p class="quote-author">— Try refreshing</p>
      </div>
    `;
  }
}

loadRandomQuote();

if (refreshQuoteBtn) {
  refreshQuoteBtn.addEventListener("click", loadRandomQuote);
}

document.getElementById("year").textContent = new Date().getFullYear();