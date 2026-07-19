# Backend Inventory Sync API

API básica en Node.js y Express para practicar consumo de APIs externas, separación por capas y manejo controlado de errores.

## Objetivo

El objetivo del proyecto es construir una API backend que consulte productos desde una API externa, exponga endpoints propios y gestione errores de forma controlada mediante middleware.

## Tecnologías

- Node.js
- Express
- JavaScript ES Modules
- Fetch API

## Instalación

```bash
npm install
```
## Integracion continua

El proyecto incluye una validacion basica con GitHub Actions.

El workflow se ejecuta en pushes a `main` y en Pull Requests hacia `main`.

La CI realiza estos pasos:

- Descarga el repositorio.
- Configura Node.js 22.
- Instala dependencias con `npm ci`.
- Ejecuta `npm run check`.

Actualmente `npm run check` usa `node --check app.js`, que solo valida la sintaxis de `app.js` y no arranca Express ni conecta con MySQL.

