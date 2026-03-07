# yousseftech-wrapped

A modern multi-page portfolio with a Supabase-backed certificates system.

## Pages
- `index.html`: Homepage with hero, achievements, skills, and profile picture placeholder.
- `repos.html`: GitHub API powered repositories page displaying stars, open issues, and forks.
- `certificates.html`: Certificates page backed by Supabase (no localStorage).

## Tech setup
- Static pages for UI.
- Vercel serverless API route (`/api/certificates`) for secure Supabase access.
- Supabase credentials are read from environment variables only.

## Environment variables
Create these secrets in Vercel Project Settings (or in local `.env` for development):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

> Do not commit real secrets to the repository.

## Supabase table SQL
```sql
create table if not exists public.certificates (
  id bigserial primary key,
  title text not null,
  issuer text not null,
  date text not null,
  url text,
  created_at timestamptz not null default now()
);
```

## Run locally
```bash
npm install
vercel dev
```
Then open `http://localhost:3000`.

## Deploy
- **Vercel (recommended):** import repo and configure environment variables above.
- **GitHub Pages limitation:** API routes and secret env vars are not available on pure static GitHub Pages.

## Why this is safer
Supabase credentials are never shipped to the browser; database operations happen only in server-side API routes using environment secrets.
