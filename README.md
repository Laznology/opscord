# Opscord

A Discord bot for managing Cloudflare DNS records through Discord slash commands. Built with NestJS, Discord.js, and Cloudflare API integration.

## Features

- **Discord Integration**: Slash commands for DNS management
- **Cloudflare DNS Management**: Create, update, and delete DNS records
- **Domain Management**: Support for multiple domains
- **Tunnel Integration**: Cloudflare Tunnel configuration management
- **Database**: SQLite with Drizzle ORM for data persistence
- **Security**: User authentication and authorization

## Prerequisites

- [Bun](https://bun.sh) runtime
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

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDFLARE_API_KEY` | Cloudflare API token | Yes |
| `DISCORD_TOKEN` | Discord bot token | Yes |
| `DISCORD_DEVELOPMENT_GUILD_ID` | Discord server ID for development | Yes |
| `DISCORD_OWNER_ID` | Discord user ID for bot authorization | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment mode | No |

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

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
