# Dependencies step to avoid rebuilds if the package.json or package-lock.json have not changed.
FROM node:16-alpine as deps

RUN adduser -D mangatsu && mkdir /home/mangatsu/deps
WORKDIR /home/mangatsu/deps

COPY package.json package-lock.json ./
RUN npm install npm@latest -g && npm install

FROM node:16-alpine as runner
ENV NODE_ENV=production

RUN mkdir /mangatsuweb
RUN chown -R node:node /mangatsuweb
USER node

WORKDIR /mangatsuweb
COPY . .
COPY --from=deps /home/mangatsu/deps/node_modules ./node_modules

RUN NEXT_PUBLIC_MANGATSU_API_URL=APP_NEXT_PUBLIC_MANGATSU_API_URL npm run build
RUN npx next telemetry disable

EXPOSE 3000

# Thanks https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl
ENTRYPOINT ["/mangatsuweb/entrypoint.sh"]
CMD npm start