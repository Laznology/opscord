# Opscord

Discord bot untuk mengelola Cloudflare DNS records melalui Discord slash commands.

## Tech Stack

- **Runtime:** Bun
- **Framework:** NestJS + Necord (Discord)
- **Database:** SQLite + Drizzle ORM
- **API:** Cloudflare API

## Quick Start

```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env dengan Discord token & Cloudflare API key

# Run migrations
bun run db:migrate

# Start development
bun run start:dev
```

## Docker

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.yml up -d
```

## Environment Variables

| Variable                       | Description                 | Required |
| ------------------------------ | --------------------------- | -------- |
| `DISCORD_TOKEN`                | Discord bot token           | Yes      |
| `DISCORD_DEVELOPMENT_GUILD_ID` | Discord server ID           | Yes      |
| `DISCORD_OWNER_ID`             | Bot owner user ID           | Yes      |
| `CLOUDFLARE_API_KEY`           | Cloudflare API token        | Yes      |
| `PORT`                         | Server port (default: 3000) | No       |

## Discord Commands

- `/list-domain` - List registered domains
- `/register-domain` - Register new domain via modal
- `/delete-domain` - Delete domain
- `/sync-domain` - Manual sync DNS records
- `/dns list` - List DNS records
- `/dns create` - Create DNS record
- `/dns update` - Update DNS record
- `/dns delete` - Delete DNS record

## Database

```bash
# Generate migration after schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

## License

MIT
