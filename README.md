# yousseftech-wrapped

A modern multi-page portfolio.

## Pages
- `index.html`: Homepage with hero, skills, and highlights.
- `repos.html`: GitHub API-powered repositories page showing stars, issues, and forks.
- `certificates.html`: Certificates page powered by `data/certificates.json`.

## Content files
- `data/achievements.json`: Source of truth for the homepage Highlights & Achievements section.
- `data/certificates.json`: Source of truth for the certificates page.

You can edit those two JSON files directly to update your portfolio content.

## Certificates workflow
1. Open the Certificates page.
2. Add/remove entries in the UI.
3. Click **Download certificates.json**.
4. Replace `data/certificates.json` in the repo with the downloaded file.

## Run locally
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.
