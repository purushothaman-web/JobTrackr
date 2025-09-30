
# Frontend API Usage Documentation

This document describes how the frontend interacts with the backend API, including service functions, response formats, and error handling conventions.

## API Service Layer
All API calls are made through service functions in `src/services/JobService.jsx` and context in `src/context/AuthContext.jsx`.

### Response Format
All backend responses follow this format:
```json
{
  "success": true/false,
  "data": { ... },
  "error": "Error message if any"
}
```

### Error Handling
- All API errors are caught and displayed to the user.
- Rate limit errors (HTTP 429) show a yellow warning banner: "Too many requests. Please try again later."
- Validation and auth errors are shown as styled error messages.
- Toast notifications for success and error feedback.
- Errors are shown in the main content area or as toast notifications.

### JobService Functions
- `fetchJobs({ token, ...filters })`: Fetch jobs with filters and pagination.
- `fetchJob({ id, token })`: Fetch a single job by ID.
- `createJob({ position, company, location, status, notes, token })`: Create a new job.
- `updateJob({ id, position, company, location, status, notes, token })`: Update a job.
- `deleteJob({ id, token })`: Delete a job.
- `updateJobStatus({ token, id, status })`: Update job status.

### AuthContext Functions
- `register(data)`: Register a new user.
- `login(data)`: Login user.
- `logout()`: Logout user.

### UI Features
- Errors are shown in the main content area or as toast notifications.
- Rate limit errors use a yellow banner for visibility.
- CSV export available for job data.
- Responsive UI and sticky footer.

## Example Usage
```js
import { fetchJobs } from '../services/JobService';

try {
  const jobs = await fetchJobs({ token, page: 1 });
  // Use jobs data
} catch (err) {
  // Display err.message in UI
}
```

## Best Practices
- Always handle errors and display user-friendly messages.
- Use the provided service functions for all API calls.
- Keep UI feedback clear and consistent.
- Use toast notifications for feedback.
- Use CSV export for data backup or sharing.

---
For further details, see the code in `src/services/JobService.jsx` and `src/context/AuthContext.jsx`.