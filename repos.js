const repoGrid = document.getElementById("repoGrid");
const statusText = document.getElementById("repoStatus");
const usernameInput = document.getElementById("username");
const loadReposBtn = document.getElementById("loadRepos");

async function loadRepos() {
  const username = usernameInput.value.trim();

  if (!username) {
    statusText.textContent = "Please provide a GitHub username.";
    return;
  }

  statusText.textContent = `Loading repositories for ${username}...`;
  repoGrid.innerHTML = "";

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        username
      )}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    if (!repos.length) {
      statusText.textContent = "No public repositories found.";
      return;
    }

    statusText.textContent = `Showing ${repos.length} repositories.`;

    repos.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "repo-card reveal-up";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description provided."}</p>
        <div class="meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🐞 ${repo.open_issues_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
        <p><a class="btn" href="${repo.html_url}" target="_blank" rel="noreferrer">Open Repository</a></p>
      `;
      repoGrid.appendChild(card);
    });
  } catch (error) {
    statusText.textContent = `Could not load repositories: ${error.message}`;
  }
}

loadReposBtn.addEventListener("click", loadRepos);
loadRepos();
