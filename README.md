# Opscord

A Discord bot for managing Cloudflare DNS records through Discord slash commands. Built with NestJS, Discord.js, and Cloudflare API integration.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework:** [NestJS](https://nestjs.com) - Node.js framework
- **Database:** SQLite with [Drizzle ORM](https://orm.drizzle.team)
- **Discord:** [Necord](https://necord.org) - NestJS Discord integration
- **Cloudflare:** [Cloudflare API](https://api.cloudflare.com) - DNS management
- **Deployment:** Docker with multi-stage builds

## Features

- **Discord Integration**: Slash commands for DNS management
- **Cloudflare DNS Management**: Create, update, and delete DNS records
- **Domain Management**: Support for multiple domains
- **Tunnel Integration**: Cloudflare Tunnel configuration management
- **Database**: SQLite with Drizzle ORM for data persistence
- **Security**: User authentication and authorization

## Prerequisites

- [Bun](https://bun.sh) runtime (for local development)
- [Docker](https://docker.com) (for containerized deployment)
- Discord Bot Application
- Cloudflare Account with API access

## Environment Setup

1. **Copy environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables in `.env`:**

   ### Discord Configuration
   - Get your bot token from [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application → Bot → Copy Token
   - Get your server ID by right-clicking your Discord server → Copy Server ID
   - Get your user ID by right-clicking your username → Copy User ID

   ### Cloudflare Configuration
   - Create API Token at [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Required permissions: `Zone:Zone:Read`, `Zone:DNS:Edit`

3. **Required Discord Bot Permissions:**
   - `applications.commands` (for slash commands)
   - `Send Messages`
   - `Use Slash Commands`

## Project Setup

```bash
# Install dependencies
$ bun install

# Generate database schema
$ bun run db:generate

# Run database migrations
$ bun run db:migrate
```

## Docker Setup

This project includes Docker configuration for easy deployment and development.

### Development with Docker

```bash
# Build the development image
$ docker-compose build

# Run in development mode
$ docker-compose up

# Run in background
$ docker-compose up -d

# View logs
$ docker-compose logs -f

# Stop containers
$ docker-compose down
```

### Production Deployment

```bash
# Build production image
$ docker-compose -f docker-compose.yml build

# Run in production
$ docker-compose -f docker-compose.yml up -d

# Check container status
$ docker-compose ps

# View production logs
$ docker-compose logs -f app
```

### Docker Configuration

The Docker setup includes:

- **Multi-stage builds** for optimized production images
- **SQLite database** with persistent volume mounting
- **Automatic migrations** on container startup
- **Environment-based logging** (disabled in production)

### Environment Variables for Docker

| Variable   | Docker Default | Description                                    |
| ---------- | -------------- | ---------------------------------------------- |
| `NODE_ENV` | `production`   | Set to `development` in `.env` for dev logging |
| `PORT`     | `3000`         | Container internal port                        |

## Running the Application

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Database Management

```bash
# Generate new migrations after schema changes
$ bun run db:generate

# Apply migrations
$ bun run db:migrate

# Open database studio
$ bun run db:studio
```

## Available Commands

The bot provides the following Discord slash commands:

- `/dns list` - List all DNS records for a domain
- `/dns create` - Create a new DNS record
- `/dns update` - Update an existing DNS record
- `/dns delete` - Delete a DNS record

## Run Tests

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Project Structure

```
src/
├── cloudflare/          # Cloudflare API service
├── common/              # Shared guards, filters, utilities
├── components/          # Discord UI components
├── cron/                # Scheduled tasks
├── db/                  # Database configuration and schema
├── discord/             # Discord bot commands and handlers
├── domain/              # Domain management logic
├── tunnel/              # Cloudflare Tunnel management
└── user/                # User management
```

## Environment Variables

| Variable                       | Description                           | Required |
| ------------------------------ | ------------------------------------- | -------- |
| `CLOUDFLARE_API_KEY`           | Cloudflare API token                  | Yes      |
| `DISCORD_TOKEN`                | Discord bot token                     | Yes      |
| `DISCORD_DEVELOPMENT_GUILD_ID` | Discord server ID for development     | Yes      |
| `DISCORD_OWNER_ID`             | Discord user ID for bot authorization | Yes      |
| `PORT`                         | Server port (default: 3000)           | No       |
| `NODE_ENV`                     | Environment mode                      | No       |

## Deployment

### Production Deployment with Docker

1. **Prepare environment:**

   ```bash
   # Copy and configure environment file
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and deploy:**

   ```bash
   # Build production image
   docker-compose build

   # Run in production mode
   docker-compose up -d

   # Verify deployment
   docker-compose ps
   docker-compose logs -f app
   ```

3. **Database persistence:**
   - SQLite database is stored in `./.data/sqlite.db`
   - Mount this volume for data persistence
   - Back up this file regularly for data safety

### Production Considerations

- **Environment Variables:** Ensure all required environment variables are set in `.env`
- **Database Backups:** Regularly backup `./.data/sqlite.db`
- **Logs:** Monitor application logs with `docker-compose logs -f`
- **Updates:** To update the application:
  ```bash
  docker-compose down
  git pull
  docker-compose build
  docker-compose up -d
  ```

### Cloud Deployment

For cloud deployment, you can:

1. **Build the image locally:**

   ```bash
   docker build -t opscord .
   ```

2. **Push to container registry:**

   ```bash
   docker tag opscord your-registry/opscord:latest
   docker push your-registry/opscord:latest
   ```

3. **Deploy on cloud platforms** (AWS ECS, Google Cloud Run, etc.) using the pushed image

### Manual Production Setup (without Docker)

If you prefer not to use Docker:

```bash
# Install dependencies
$ bun install --production

# Build the application
$ bun run build

# Run database migrations
$ bun run db:migrate

# Start production server
$ bun run start:prod
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
