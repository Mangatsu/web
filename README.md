<h1 align="center"> Mangatsu Web</h1>

<p align="center">
  <img src="public/logo-small.png" />
</p>

> 🌕 Frontend for [Mangatsu server](https://github.com/Mangatsu/server) (a storage for doujinshi, manga & other collections). Written in TypeScript using Nextjs.

### Read the [README of Mangatsu Server](https://github.com/Mangatsu/server) for instructions to run

### [📰 CHANGELOG](docs/CHANGELOG.md) | **[❤ CONTRIBUTING](docs/CONTRIBUTING.md)**

## 🐳 Docker

#### GitHub Container Registry: [server](https://github.com/Mangatsu/server/pkgs/container/server) & [web](https://github.com/Mangatsu/server/pkgs/container/server)

#### DockerHub: [Web](https://hub.docker.com/r/luukuton/mangatsu-web) & [Server](https://hub.docker.com/r/luukuton/mangatsu-server/)

## 💨 Running for development

- Preferably have [Mangatsu Server](https://github.com/Mangatsu/server) running
- Install Node.js ([nvm](https://github.com/nvm-sh/nvm) recommended) and npm
- Copy `example.env.local` as `.env.local` and change values
- Run `npm i` to install all dependencies
- Run `npm run dev` to start the development version
- **OR**
- Run `npm run build` and `npm start` for the production version

## ❗ Requirements

- [Node.js](https://nodejs.org) v20+ ([nvm](https://github.com/nvm-sh/nvm) recommended)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) v10+
- [Mangatsu Server](https://github.com/Mangatsu/server)
- [Docker](https://docs.docker.com/engine/install/) (optional, recommended)
