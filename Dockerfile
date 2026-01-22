FROM oven/bun:1 as base
WORKDIR /app

FROM base as install
RUN mkdir -p /temp/release/
COPY package.json bun.lock /temp/release/
RUN cd /temp/release && bun install --frozen-lockfile

FROM base as build
COPY --from=install /temp/release/node_modules node_modules
COPY --from=install /temp/release/package.json .
COPY . .
RUN bun run build

FROM base as release
COPY --from=install /temp/release/node_modules node_modules
COPY --from=install /temp/release/package.json .
COPY --from=build /app/drizzle.config.ts .
COPY --from=build /app/src/db/migration src/db/migration
COPY --from=build /app/dist dist
RUN mkdir -p /app/src/db src/db .data
RUN bun db:migrate
ENV NODE_ENV=production
USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "start:prod" ]