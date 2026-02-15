# JobTrackr Frontend (PERN)

Vite + React UI for JobTrackr.

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS v4
- Axios, react-toastify
- Chart.js
- PWA via `vite-plugin-pwa`

## Project Structure

- `src/components/` UI components
- `src/pages/` pages and views
- `src/context/` auth state
- `src/services/` API layer
- `src/config.js` env config

## Environment

Create `frontend/.env` from `frontend/.env.example`:

- `VITE_API_URL=http://localhost:5000/api`

## Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev` (Vite defaults to `http://localhost:5173`)

## Build and Preview

- `npm run build`
- `npm run preview`

## API Docs

See `frontend/API_DOCS.md`.
