# afstim

The Afstim CLI. Checks your work against your current mission.

## Commands

```
afstim login    Log in with a token from https://afstim.com/settings/cli
afstim status   Show your current mission and progress
```

## Local development

```
npm install
npm run build
node dist/index.js login
```

Point it at a local server instead of https://afstim.com with:

```
AFSTIM_API_URL=http://localhost:3000 node dist/index.js login
```
