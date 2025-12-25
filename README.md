
# JobTrackr

JobTrackr is a full-stack web application to streamline job applications. It helps users manage applications, track progress, and receive reminders.

## Features

- User authentication (register, login, profile, Google login)
- Job management (add, edit, delete, status updates)
- Responsive UI (mobile/tablet/desktop)
- Sticky footer (always at the bottom)
- Email notifications for deadlines
- CSV export of job data
- Rate limit error banners
- Robust error and validation handling
- Consistent API response format: `{ success, data, error }`
- Toast notifications for feedback

## Project Structure

- `Backend/`: Node.js, Express, Prisma, PostgreSQL, JWT, Nodemailer
	- `controllers/`, `middleware/`, `routes/`, `repositories/`, `utils/`, `cron/`, `prisma/`, `server.mjs`
- `Frontend/`: React, React Router, Tailwind CSS, Axios
	- `src/App.jsx`, `src/routes/AppRoutes.jsx`, `src/pages/`, `src/components/`, `src/context/`, `src/services/`

## Setup Instructions

1. **Clone the repository**
	 ```bash
	 git clone https://github.com/purushothaman-web/JobTrackr.git
	 cd JobTrackr
	 ```

2. **Backend Setup**
	 - `cd Backend`
	 - `npm install`
	 - Create `.env` from `.env.example` and update values.
	 - Run migrations:
		 ```bash
		 npx prisma generate
		 npx prisma migrate dev
		 ```
	 - Start server: `npm run dev` (Runs on port 5000 by default)

3. **Frontend Setup**
	 - `cd ../Frontend`
	 - `npm install`
	 - Create `.env` from `.env.example` and set:
		 ```
		 VITE_API_URL=http://localhost:5000/api
		 ```
	 - Start dev server: `npm run dev`

4. **Access the app**
	 - Open `http://localhost:3000` in your browser.

## API Documentation

See [`frontend/API_DOCS.md`](./frontend/API_DOCS.md) for frontend API usage.

## Troubleshooting

- Ensure backend is running before starting frontend.
- Check `.env` files for correct API/database URLs.
- For migration issues, run `npx prisma migrate dev` again.

## Contributing

- Fork the repo and create a feature branch.
- Submit pull requests with clear descriptions.
- See `CONTRIBUTING.md` for guidelines (add this file if missing).

## License

MIT (add a `LICENSE` file if missing)