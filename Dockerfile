FROM node:16-alpine as deps

WORKDIR /deps
# Copies only package.json and lock file to avoid rebuilds if the package.json hasn't changed.
COPY package.json package-lock.json ./
RUN npm install npm@latest -g && npm install

FROM node:16-alpine as build
ENV NODE_ENV=production

WORKDIR /build
COPY . .
COPY --from=deps /deps ./
RUN npm run build

FROM node:16-alpine
ENV NODE_ENV=production

RUN adduser -D mangatsu && mkdir /home/mangatsu/webapp
USER mangatsu
WORKDIR /home/mangatsu/webapp

COPY --from=build /build/package*.json ./
COPY --from=build /build/public ./node_modules
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public

EXPOSE 3000

CMD ["npm", "start"]
