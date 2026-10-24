# around-ai

Personal AI blog at [around-ai.com](https://around-ai.com). Self-hosted with Docker on this machine and published through a Cloudflare Tunnel.

- **App**: Next.js 14 (pages router) + Tailwind
- **Database**: PostgreSQL 16 via Prisma. Posts are stored as Markdown.
- **Attachments**: uploaded through the admin and stored in the `uploads` Docker volume, served at `/uploads/<file>`
- **Admin**: `/admin`, protected by the password in `.env`
- **Public access**: the `cloudflared` container connects the `around-ai` tunnel to `around-ai.com` and `www.around-ai.com` (www redirects to the apex)

## Running

```bash
cp .env.example .env            # first time only: fill in the passwords, SESSION_SECRET and TUNNEL_TOKEN
docker compose --profile public up -d --build   # db + app + tunnel
docker compose up -d --build    # db + app only (local, http://127.0.0.1:3200)
```

Migrations and the seed (the `/about` page) run automatically when the app container starts.

Update after code changes:

```bash
docker compose --profile public up -d --build app
```

## Writing posts

1. Open `https://around-ai.com/admin` and sign in with `ADMIN_PASSWORD`.
2. **New post**: write in Markdown, with live preview in the *Preview* tab.
   - Paste or drop images and files straight into the editor to upload them (max `MAX_UPLOAD_MB`, default 50 MB).
   - Code blocks get syntax highlighting. Use a ```` ```mermaid ```` block for a diagram.
   - Raw HTML in a post is not rendered.
3. Post status:
   - **Draft**: hidden
   - **Published**: shown on the home page
   - **Unlisted**: reachable only by its link, not indexed
4. **Type = Page**: a standalone page that is not listed in the feed (for example `/about`).
5. `Ctrl/Cmd + S` saves.

## Other routes

| Route | Content |
| --- | --- |
| `/feed`, `/rss.xml` | RSS |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots (blocks `/admin` and `/api`) |
| `/api/health` | Health check (also checks the DB) |

## Backups

```bash
# database
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > backup-$(date +%F).sql
# attachments
docker run --rm -v around-ai_uploads:/data -v "$PWD":/out alpine tar czf /out/uploads-$(date +%F).tgz -C /data .
```

## Local development

```bash
docker compose up -d db         # needs DATABASE_URL in .env pointing at localhost:5432 (expose the port if needed)
npm install
npx prisma migrate deploy && npm run db:seed
npm run dev
```

Blog settings (name, bio, social links, theme) are in `site.config.js`.
