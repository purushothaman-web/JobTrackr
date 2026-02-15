# JobTrackr

JobTrackr includes two implementations:

1. PERN stack
- `Backend/` (Express + Prisma + PostgreSQL API)
- `frontend/` (Vite + React UI)

2. Next.js full stack
- `jobtrackr-njs/` (Next.js 16 App Router + Prisma)

## Quickstart (PERN)

Backend:
1. `cd Backend`
2. `npm install`
3. Create `Backend/.env` from `Backend/.env.example` and set values.
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npm run dev` (defaults to `http://localhost:5000`)

Frontend:
1. `cd frontend`
2. `npm install`
3. Create `frontend/.env` from `frontend/.env.example`.
4. Ensure `VITE_API_URL=http://localhost:5000/api`.
5. `npm run dev` (Vite defaults to `http://localhost:5173`)

## Quickstart (Next.js)

1. `cd jobtrackr-njs`
2. `npm install`
3. Create `.env` using `jobtrackr-njs/.env.production.example` as a template and set values.
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npm run dev` (defaults to `http://localhost:3000`)

See `jobtrackr-njs/README.md` for production deployment steps and notes.
