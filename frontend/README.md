
# JobTrackr Frontend

The React-based frontend for JobTrackr, providing a modern, responsive UI for job tracking and user management.

## Features

- Authentication pages (login, register, forgot password, profile, Google login)
- Job views (list, add, edit, details)
- Responsive UI (mobile/tablet/desktop)
- Sticky footer (always at the bottom)
- Form handling and validation
- Toast notifications and error pages
- Robust error handling and rate limit UI (yellow banner)
- CSV export of job data
- Consistent API response handling
- [Frontend API Usage Docs](./API_DOCS.md) for developers

## Code Structure

- `src/App.jsx`: Main app with routes, header, footer, sticky footer layout
- `src/routes/AppRoutes.jsx`: Routing with auth guards
- `src/pages/`: Page components (Jobs, AddJob, EditJob, JobDetails, Login, Register, etc.)
- `src/components/`: Reusables (Header, Footer, JobCard, FormField, Button, etc.)
- `src/context/`: Auth state management
- `src/services/`: API calls (JobService)

## Technologies

- React, React Router, Tailwind CSS
- react-toastify, Axios (for APIs)

## Setup Instructions

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure the API URL:**
    - Create a `.env` file in the root of the `frontend` directory.
    - Add the `VITE_API_URL` variable to point to your backend API.
    - Example `.env` file:
      ```
      VITE_API_URL=http://localhost:5000/api
      ```
    - **Note:** Ensure that the `VITE_` prefix is used for Vite to recognize the environment variable.
4.  Start the development server:
    ```bash
    npm run dev
    ```
    (starts on port 3000 by default)
5.  Build for production:
    ```bash
    npm run build
    ```

Connects to Backend API; ensure backend is running.

## Troubleshooting

- Make sure the backend server is running before starting the frontend.
- Check `.env` for correct API URL.
- For build issues, delete `node_modules` and reinstall dependencies.

## Contributing

- Fork the repo and create a feature branch.
- Submit pull requests with clear descriptions.
- See `CONTRIBUTING.md` for guidelines (add this file if missing).