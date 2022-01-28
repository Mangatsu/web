# Dependencies step to avoid rebuilds if the package.json or package-lock.json have not changed.
FROM node:16-alpine as build-deps

WORKDIR /mtsu-deps
COPY --chown=node:node package.json package-lock.json ./

RUN npm install npm@latest -g && npm install

# Only production dependencies (no devDependencies).
FROM node:16-alpine as prod-deps
ENV NODE_ENV=production

WORKDIR /mtsu-deps
COPY --chown=node:node package.json package-lock.json ./

RUN npm install npm@latest -g && npm install

FROM node:16-alpine AS builder
ENV NODE_ENV=production

WORKDIR /mtsu-build
COPY --chown=node:node . .
COPY --chown=node:node --from=build-deps /mtsu-deps/node_modules ./node_modules

RUN NEXT_PUBLIC_MANGATSU_API_URL=APP_NEXT_PUBLIC_MANGATSU_API_URL npm run build

FROM node:16-alpine as runner
ENV NODE_ENV=production

WORKDIR /mtsu-web
RUN chown -R node:node /mtsu-web
COPY --chown=node:node --from=builder /mtsu-build/public ./public
COPY --chown=node:node --from=builder /mtsu-build/.next ./.next
COPY --chown=node:node --from=builder /mtsu-build/package.json ./package.json
COPY --chown=node:node --from=builder /mtsu-build/entrypoint.sh ./entrypoint.sh
COPY --chown=node:node --from=prod-deps /mtsu-deps/node_modules ./node_modules

USER root
RUN chmod +x /mtsu-web/entrypoint.sh
USER node

EXPOSE 3030

RUN npx next telemetry disable

# Thanks https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl
ENTRYPOINT ["/mtsu-web/entrypoint.sh"]
CMD npm start