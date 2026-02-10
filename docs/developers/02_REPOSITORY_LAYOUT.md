# Repository Layout

This is a single repository with a frontend and an Express server.

Top-level:

- `/src` Frontend (React + Vite)
- `/server` Backend (Express)
- `/docs` Documentation

Frontend conventions:

- `/src/pages/<pageName>/...` contains page components
- `/src/pages/<pageName>/sections/...` contains page-scoped sections
- `/src/components/...` contains reusable UI and structure components

Backend:

- `/server/index.js` is the Express entrypoint
- `/server/routes/checkout.js` checkout + payment endpoints
- `/server/routes/email.js` email endpoint (Resend)
- `/server/utility/environment.js` central environment accessors

---

## Root Scripts (package.json)

The root package.json defines these scripts:

- `dev:client`: runs Vite
- `dev:server`: runs the Express server (watch mode) using `--prefix server`
- `dev`: attempts to run both server and client
- `build:client`: builds Vite and copies `dist/index.html` --> `dist/404.html` for static hosting fallbacks
- `build:server`: installs server dependencies
- `build`: builds client then installs server dependencies
- `preview`: Vite preview

Note on `dev`:

- The current `dev` script is defined as:
  `start npm run dev:server && npm run dev:client`

Depending on your OS/shell, you may want to run the server and client in separate terminals, or adjust to a parallel command runner.

---

## Server Scripts (server/package.json)

Inside `/server`:

- `dev`: `node --watch index.js`
- `start`: `node index.js`

The server runs on port 3001 by default.
