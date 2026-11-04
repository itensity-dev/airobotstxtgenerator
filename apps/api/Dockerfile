# syntax=docker/dockerfile:1.7
# robots.txt fetch service (Hono on Node, non-root, port 8081).
ARG NODE_IMAGE=node:26-alpine

FROM ${NODE_IMAGE} AS build
WORKDIR /app
# Optional build secret "ca": an extra root certificate for builds behind a TLS-intercepting proxy.
ENV NODE_EXTRA_CA_CERTS=/run/secrets/ca
RUN --mount=type=secret,id=ca,required=false npm install -g pnpm@10.28.0 --no-fund --no-audit
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/core/package.json packages/core/
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
RUN --mount=type=secret,id=ca,required=false --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --filter "@airobots/api..."
COPY apps/api apps/api
RUN --mount=type=secret,id=ca,required=false pnpm --filter @airobots/api build \
 && pnpm --filter @airobots/api deploy --prod --legacy /out \
 && cp -r apps/api/dist /out/dist

FROM ${NODE_IMAGE}
ENV NODE_ENV=production PORT=8081
WORKDIR /app
COPY --from=build --chown=node:node /out/node_modules ./node_modules
COPY --from=build --chown=node:node /out/dist ./dist
COPY --from=build --chown=node:node /out/package.json ./package.json
USER node
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD ["node", "dist/healthcheck.js"]
CMD ["node", "dist/server.js"]
