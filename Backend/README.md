
# JobTrackr Backend

The backend API for JobTrackr, managing authentication, jobs, and emails with a PostgreSQL database.

## Features

- User authentication (JWT, register/login/profile, email verification, password reset)
- Job CRUD operations (add, edit, delete, status updates)
- Weekly email cron for job reminders
- Rate limiting, validation, and error handling
- Consistent API response format: `{ success, data, error }` for all endpoints
- Robust error and validation handling

---
See also: [Frontend API Usage Docs](../frontend/API_DOCS.md)

## Code Structure

- `controllers/`: API logic (auth, jobs)
- `middleware/`: Auth, validation, errors
- `routes/`: Express routes
- `repositories/`: Database access
- `utils/`: Email, JWT helpers
- `cron/`: Scheduled tasks
- `prisma/`: Schema and migrations
- `server.mjs`: Entry point

## Technologies

- Node.js, Express.js, Prisma ORM, PostgreSQL
- JWT, Nodemailer, Nodemon

## Setup Instructions

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    - Create a `.env` file in the root of the `Backend` directory.
    - Copy the contents of `.env.example` to `.env` and replace the placeholders with your actual values.
    - Example `.env` file:
      ```
      DATABASE_URL="postgresql://user:password@host:port/database"
      JWT_SECRET="your_jwt_secret_key"
      EMAIL_HOST="smtp.example.com"
      EMAIL_PORT=587
      EMAIL_USER="your_email@example.com"
      EMAIL_PASS="your_email_password"
      API_URL=http://localhost:5000/api
      ```
4.  Run database migrations:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```
    (starts on port 5000 by default)

## API Endpoints (base: /api)

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, etc.
- Jobs: `GET /jobs`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`, `GET /jobs/:id`

Test with Postman or the frontend.

## Troubleshooting

- Ensure PostgreSQL is running and accessible.
- Check `.env` for correct database and API URLs.
- For migration issues, run `npx prisma migrate dev` again.

## Contributing

- Fork the repo and create a feature branch.
- Submit pull requests with clear descriptions.