document.getElementById("year").textContent = new Date().getFullYear();

async function loadAchievements() {
  const list = document.getElementById("achievementsList");

  if (!list) {
    return;
  }

  try {
    const response = await fetch("data/achievements.json");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Could not load achievements.");
    }

    list.innerHTML = data
      .map(
        (item) => `
          <article>
            <h3>${item.icon || "✨"} ${item.title}</h3>
            <p>${item.description}</p>
          </article>
        `
      )
      .join("");
  } catch {
    list.innerHTML = "<p class='muted'>Unable to load achievements right now.</p>";
  }
}

loadAchievements();
