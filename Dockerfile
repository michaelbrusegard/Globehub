FROM imbios/bun-node:20-slim

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

ARG NODE_ENV

ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=${NODE_ENV}

RUN bun run build

EXPOSE 3000

ENTRYPOINT [ "bun", "run", "start" ]
