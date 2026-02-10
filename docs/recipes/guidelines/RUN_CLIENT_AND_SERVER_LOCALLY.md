# Run Client and Server Locally

This project is a Vite React frontend (`/src`) plus an Express backend (`/server`).

Frontend dev server:

- Vite (typically `http://localhost:5173`)

Backend dev server:

- Express (`http://localhost:3001`)

---

## Install dependencies

From repo root:

```bash
npm install
```

Then install server dependencies:

```bash
npm install --prefix server
```

## Configure server environment

Create:

```
cp server/.env.template server/.env
```

Minimum keys for basic operation:

```
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

If testing payments or email locally, configure:

- Stripe keys

- PayPal keys

- Resend API key

## Start the server

```bash
npm run dev:server
```

Expected:

```
Express running on http://localhost:3001
```

## Start the client

```bash
npm run dev:client
```

Expected:

```
Vite running on http://localhost:5173
```

## Validate basic connectivity

- Visit frontend in browser
- Hit server health endpoint directly:

Local server health:

```cmd
GET http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Source of Hope API is running"
}
```
