```markdown

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
- `updateJob({ id, token })`: Update a job.
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

## API Testing Guide

### Backend Testing

To test the backend API endpoints, you can use tools like Postman, Insomnia, `curl`, or Thunder Client. Here are examples for each:

#### Using `curl`:

##### Fetch all jobs:

```shell
curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000/api/v1/jobs
```

##### Create a new job:

```shell
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
  "position": "Software Engineer",
  "company": "Google",
  "location": "Mountain View, CA",
  "status": "applied",
  "notes": "Sent resume and cover letter."
}' http://localhost:3000/api/v1/jobs
```

##### Update an existing job:

```shell
curl -X PATCH -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
  "status": "interviewing"
}' http://localhost:3000/api/v1/jobs/<job_id>
```

##### Delete a job:

```shell
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:3000/api/v1/jobs/<job_id>
```

#### Using Postman:

1.  Download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
2.  Create a new request in Postman.
3.  Enter the API endpoint URL (e.g., `http://localhost:3000/api/v1/jobs`).
4.  Select the HTTP method (e.g., `GET`, `POST`, `PATCH`, `DELETE`).
5.  Add the `Authorization` header with the value `Bearer <token>`. Replace `<token>` with your actual JWT.
6.  If you are making a `POST` or `PATCH` request, add the request body in JSON format.
7.  Click the `Send` button to send the request.
8.  View the response in the Postman window.

   **Example for fetching all jobs:**

    *   **Method:** `GET`
    *   **URL:** `http://localhost:3000/api/v1/jobs`
    *   **Headers:**
        *   `Authorization`: `Bearer <your_token>`

   **Example for creating a job:**

    *   **Method:** `POST`
    *   **URL:** `http://localhost:3000/api/v1/jobs`
    *   **Headers:**
        *   `Authorization`: `Bearer <your_token>`
        *   `Content-Type`: `application/json`
    *   **Body:**

```json
{
    "position": "Software Engineer",
    "company": "Acme Corp",
    "location": "New York",
    "status": "applied",
    "notes": "Applied through LinkedIn"
}
```

### Frontend Testing

For frontend testing, you can use browser developer tools to inspect network requests and responses. Additionally, you can use testing libraries like Jest and React Testing Library to write unit and integration tests for your components and service functions.

#### Example Jest test for `fetchJobs`:

```javascript
import { fetchJobs } from '../services/JobService';

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: [{ id: 1, position: 'Software Engineer' }] }),
    ok: true,
  })
);


describe('fetchJobs', () => {
  it('fetches jobs successfully', async () => {
    const token = 'testToken';
    const filters = { page: 1 };
    const jobs = await fetchJobs({ token, ...filters });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/jobs?page=1',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(jobs).toEqual([{ id: 1, position: 'Software Engineer' }]);
  });
});
```

### Mocking Backend

During development or testing, it can be helpful to mock the backend API. You can use libraries like `msw` (Mock Service Worker) to intercept API requests and return mock responses. This allows you to test your frontend code in isolation without relying on a live backend.

## Backend API Documentation

### Authentication

All routes except for `POST /register`, `POST /login`, `GET /verify-email/:token`, and `POST /resend-verification` require authentication. You must include a valid JWT in the `Authorization` header as a Bearer token.

Example:

```
Authorization: Bearer <your_jwt_token>
```

#### 1. Register

*   **Endpoint:** `POST /register`
*   **Description:** Registers a new user.
*   **Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

*   **Success Response:**

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

*   **Error Response:**

```json
{
  "success": false,
  "data": null,
  "error": "Email already exists"
}
```

#### 2. Login

*   **Endpoint:** `POST /login`
*   **Description:** Logs in an existing user.
*   **Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

*   **Success Response:**

```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  },
  "error": null
}
```

*   **Error Response:**

```json
{
  "success": false,
  "data": null,
  "error": "Invalid credentials"
}
```

#### 3. Logout

*   **Endpoint:** `POST /logout`
*   **Description:** Logs out the current user.
*   **Request Body:** None
*   **Success Response:**

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

#### 4. Get Profile

*   **Endpoint:** `GET /me`
*   **Description:** Retrieves the profile of the authenticated user.
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Success Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "error": null
}
```

#### 5. Update Profile

*   **Endpoint:** `PUT /update-profile`
*   **Description:** Updates the profile of the authenticated user.
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

*   **Success Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
  },
  "error": null
}
```

#### 6. Forgot Password

*   **Endpoint:** `POST /forgot-password`
*   **Description:** Initiates the password reset process.
*   **Request Body:**

```json
{
  "email": "john.doe@example.com"
}
```

*   **Success Response:**

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

#### 7. Reset Password

*   **Endpoint:** `POST /reset-password`
*   **Description:** Resets the user's password.
*   **Request Body:**

```json
{
  "token": "",
  "password": "new_password"
}
```

*   **Success Response:**

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

#### 8. Verify Email

*   **Endpoint:** `GET /verify-email/:token`
*   **Description:** Verifies the user's email address using a token sent via email.
*   **Success Response:**

```html
<h1>Email Verified</h1>
```

#### 9. Resend Verification Email

*   **Endpoint:** `POST /resend-verification`
*   **Description:** Resends the email verification link to the user.
*   **Request Body:**

```json
{
    "email": "john.doe@example.com"
}
```

*   **Success Response:**
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### Job Management

#### 1. Get All Jobs

*   **Endpoint:** `GET /api/v1/jobs`
*   **Description:** Retrieves all jobs with pagination and filtering.
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Query Parameters:**
    * `page`: Page number (default: 1)
    * `limit`: Number of jobs per page (default: 10)
    * `status`: Filter by job status
    * `search`: Search by position, company, or location
*   **Success Response:**

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": 1,
        "position": "Software Engineer",
        "company": "Google",
        "location": "Mountain View, CA",
        "status": "applied",
        "notes": "Sent resume and cover letter."
      }
    ],
    "totalJobs": 20,
    "totalPages": 2
  },
  "error": null
}
```
#### 2. Get Job By Id
*   **Endpoint:**     `GET /api/v1/jobs/:id`
*   **Description:**  get job by id
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Success Response:**
```json
{
    "success": true,
    "data": {
        "id": 2,
        "position": "Software Engineer",
        "company": "Acme Corp",
        "location": "New York",
        "status": "interviewing",
        "notes": "First round interview scheduled."
    },
    "error": null
}
```
#### 3. Create Job
*   **Endpoint:** `POST   /api/v1/jobs`
*   **Description:** create a job
     **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
```json
{
    "position": "Software Engineer",
    "company": "Acme Corp",
    "location": "New York",
    "status": "applied",
    "notes": "Applied through LinkedIn"
}
```
*   **Success Response:**
```json
{
    "success": true,
    "data": {
        "id": 3,
        "position": "Software Engineer",
        "company": "Acme Corp",
        "location": "New York",
        "status": "applied",
        "notes": "Applied through LinkedIn"
    },
    "error": null
}
```
#### 4. Update Job
*   **Endpoint:**     `PUT  /api/v1/jobs/:id`
*   **Description:** Update a job
     **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
```json
{
    "position": "Software Engineer",
    "company": "Acme Corp",
    "location": "New York",
    "status": "interviewing",
    "notes": "First round interview scheduled."
}
```
*   **Success Response:**
```json
{
    "success": true,
    "data": {
        "id": 3,
        "position": "Software Engineer",
        "company": "Acme Corp",
        "location": "New York",
        "status": "interviewing",
        "notes": "First round interview scheduled."
    },
    "error": null
}
```
#### 5. Update Status
*   **Endpoint:**     `PATCH  /api/v1/jobs/:id/status`
*   **Description:** update job status
     **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
```json
{
    "status": "offer"
}
```
*   **Success Response:**
```json
{
    "success": true,
    "data": {
        "id": 3,
        "position": "Software Engineer",
        "company": "Acme Corp",
        "location": "New York",
        "status": "offer",
        "notes": "First round interview scheduled."
    },
    "error": null
}
```
#### 6. Delete Job
*   **Endpoint:**     `DELETE  /api/v1/jobs/:id`
*   **Description:** delete a job
     **Request Headers:** `Authorization: Bearer <token>`
*   **Success Response:**
```json
{
    "success": true,
    "data": {},
    "error": null
}
```
#### 7. Export Jobs CSV
*   **Endpoint:** `GET /api/v1/jobs/export`
*   **Description:** export jobs to csv
     **Request Headers:** `Authorization: Bearer <token>`
*   **Success Response:**
    *   Returns a CSV file
#### 8. Get Job Stats
*   **Endpoint:** `GET /api/v1/jobs/stats`
*   **Description:** get job stats
     **Request Headers:** `Authorization: Bearer <token>`
*   **Success Response:**
```json
{
    "success": true,
    "data": {
        "totalJobs": 15,
        "applied": 5,
        "interviewing": 3,
        "offer": 2,
        "rejected": 5
    },
    "error": null
}
```
#### 9. Get Job Summary Email
*   **Endpoint:** `GET /api/v1/jobs/email`
*   **Description:** get job summary email
     **Request Headers:** `Authorization: Bearer <token>`
*   **Success Response:**
```json
{
    "success": true,
    "data": {},
    "error": null
}
```

