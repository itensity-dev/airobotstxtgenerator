# syntax=docker/dockerfile:1.7
# Static site: build with Node, serve with Caddy (non-root, port 8080).
ARG NODE_IMAGE=node:26-alpine
ARG CADDY_IMAGE=caddy:2-alpine
ARG ALPINE_IMAGE=alpine:3.22

FROM ${NODE_IMAGE} AS build
WORKDIR /app
# Optional build secret "ca": an extra root certificate for builds behind a TLS-intercepting proxy.
ENV NODE_EXTRA_CA_CERTS=/run/secrets/ca
RUN --mount=type=secret,id=ca,required=false npm install -g pnpm@10.28.0 --no-fund --no-audit
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/core/package.json packages/core/
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
RUN --mount=type=secret,id=ca,required=false --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --filter "@airobots/web..."
COPY packages/core packages/core
COPY apps/web apps/web
# Build-time configuration (baked into the static HTML).
ARG SITE_URL=https://airobotstxtgenerator.com
ARG ANALYTICS_PROVIDER=none
ARG PLAUSIBLE_DOMAIN=
ARG PLAUSIBLE_SRC=
ARG GA4_ID=
ARG ADS_ENABLED=false
ARG ADSENSE_CLIENT=
ARG GSC_VERIFICATION=
ARG BING_VERIFICATION=
ARG INDEXNOW_KEY=
ARG CONTACT_EMAIL=
ARG AUTHOR_NAME=
ENV SITE_URL=$SITE_URL ANALYTICS_PROVIDER=$ANALYTICS_PROVIDER PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN PLAUSIBLE_SRC=$PLAUSIBLE_SRC \
    GA4_ID=$GA4_ID ADS_ENABLED=$ADS_ENABLED ADSENSE_CLIENT=$ADSENSE_CLIENT GSC_VERIFICATION=$GSC_VERIFICATION \
    BING_VERIFICATION=$BING_VERIFICATION INDEXNOW_KEY=$INDEXNOW_KEY CONTACT_EMAIL=$CONTACT_EMAIL AUTHOR_NAME=$AUTHOR_NAME \
    ASTRO_TELEMETRY_DISABLED=1
RUN --mount=type=secret,id=ca,required=false pnpm --filter @airobots/web build

FROM ${CADDY_IMAGE} AS caddy

# Minimal runtime: Alpine + the Caddy binary only.
FROM ${ALPINE_IMAGE}
RUN set -eux \
 && addgroup -S -g 10001 web && adduser -S -D -H -u 10001 -G web web \
 && mkdir -p /data /config && chown web:web /data /config
COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
COPY deploy/Caddyfile.web /etc/caddy/Caddyfile
COPY --from=build --chown=web:web /app/apps/web/dist /srv
ENV XDG_DATA_HOME=/data XDG_CONFIG_HOME=/config API_UPSTREAM=api:8081
USER web
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
