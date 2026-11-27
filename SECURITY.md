# Security

- No secrets in the repo. Use `.env.example` only (comments).
- Farmer data stays in the browser (IndexedDB). No server-side storage in this build.
- Content Security Policy is set in `nginx/nginx.conf` and `vercel.json`.
- Report issues privately to the repository owner.