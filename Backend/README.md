# JobTrackr Backend (PERN)

Express + Prisma API for JobTrackr.

## Tech Stack

- Node.js, Express 5
- Prisma ORM, PostgreSQL
- JWT auth, cookies
- Nodemailer
- Rate limiting and validation

## Project Structure

- `controllers/` API logic
- `routes/` Express routes
- `middleware/` auth, validation, errors
- `repositories/` database access
- `utils/` helpers
- `prisma/` schema and migrations
- `server.mjs` entry point

## Environment

Create `Backend/.env` from `Backend/.env.example` and set values:

- `PORT` (default `5000`)
- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `CLIENT_URL` (CORS origin, default `http://localhost:5173`)
- `FRONTEND_URL`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USER`
- `MAIL_PASS`
- `MAIL_FROM`

## Setup

1. `cd Backend`
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npm run dev`

## Scripts

- `npm run dev` start with nodemon
- `npm start` start with node

## API Base

`http://localhost:5000/api`

## Notes

CORS origin is taken from `CLIENT_URL` in `Backend/.env`.
