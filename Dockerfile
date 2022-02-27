# Dependencies step to avoid rebuilds if the package.json or package-lock.json have not changed.
FROM node:16-alpine as BUILD-DEPS

WORKDIR /mtsu-deps
COPY --chown=node:node package.json package-lock.json ./

RUN npm install npm@latest -g && npm install

# Build the app.
FROM node:16-alpine AS BUILDER
ENV NODE_ENV=production

WORKDIR /mtsu-build
COPY --chown=node:node . .
COPY --chown=node:node --from=BUILD-DEPS /mtsu-deps/node_modules ./node_modules

RUN NEXT_PUBLIC_MANGATSU_API_URL=APP_NEXT_PUBLIC_MANGATSU_API_URL npm run build

# Run the app.
FROM node:16-alpine as RUNNER
ENV NODE_ENV=production

WORKDIR /mtsu-web
RUN chown -R node:node /mtsu-web

COPY --chown=node:node --from=BUILDER /mtsu-build/.next/standalone ./
COPY --chown=node:node --from=BUILDER /mtsu-build/public ./public
COPY --chown=node:node --from=BUILDER /mtsu-build/.next/static ./.next/static
COPY --chown=node:node --from=BUILDER /mtsu-build/entrypoint.sh ./

USER root
RUN chmod +x /mtsu-web/entrypoint.sh
USER node

EXPOSE 3030

ENV NEXT_TELEMETRY_DISABLED 1

# Thanks https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl
ENTRYPOINT ["/mtsu-web/entrypoint.sh"]
CMD node server.js
