# Personal Task Manager

## Overview

Personal Task Manager is a responsive MERN dashboard for creating, organizing, filtering, sorting, editing, and completing tasks. It solves the problem of keeping a small personal workload visible and actionable while persisting every task in MongoDB through an Express API.

The application has no mock task dataset: task cards, counts, filters, and sorting are populated from the API.

## Features

- Create, read, update, and delete tasks.
- Required, trimmed titles with clear validation.
- Optional descriptions and due dates.
- Low, medium, and high priority indicators.
- Todo, in-progress, and done statuses.
- Dashboard counts for total, todo, in-progress, and completed tasks.
- Status filtering and due-date/priority sorting in both directions.
- Delete confirmation, loading state, empty state, and success/error feedback.
- Responsive layout for desktop and smaller screens.
- Centralized backend errors and MongoDB validation.

## Technology stack

- Frontend: React 18, Vite, Axios, React Hooks, CSS3
- Backend: Node.js, Express, Mongoose, dotenv
- Database: MongoDB local instance or MongoDB Atlas
- Testing: Vitest, Supertest, MongoDB Memory Server


## Project structure

```text
backend/
  config/db.js
  controllers/taskController.js
  middleware/errorHandler.js
  middleware/validateTask.js
  models/Task.js
  routes/taskRoutes.js
  tests/tasks.integration.test.js
  app.js
  server.js
  .env.example
  package.json
frontend/
  src/
    components/TaskCard.jsx
    components/TaskForm.jsx
    hooks/useTasks.js
    pages/Dashboard.jsx
    services/api.js
    App.jsx
    index.css
    main.jsx
  .env.example
  package.json
README.md
NOTES.md
.env.example
.gitignore
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB local installation or a MongoDB Atlas cluster
- PowerShell on Windows

The automated backend tests use MongoDB Memory Server and do not require a local MongoDB installation. Running the application itself does require a configured MongoDB connection.

## Clone and install

Replace `<repository-url>` with the repository URL supplied for your submission:

```powershell
git clone <repository-url>
cd "codewise assignment"
```

### Terminal 1 — backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` with your own MongoDB connection details.

### Terminal 2 — frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

The frontend `.env` is optional when using the default API URL. Change `VITE_API_BASE_URL` if the backend uses another host or port.

## MongoDB Atlas setup

1. Create or open a MongoDB Atlas project and cluster.
2. In **Database Access**, create a database user with password authentication and `readWrite` access to the application database.
3. In **Network Access**, allow the IP address from which the backend will connect.
4. Select **Connect → Drivers**, copy the Node.js connection string, and replace its placeholders locally in `backend/.env`.
5. Never commit `backend/.env` or paste a real connection string into README, source code, or screenshots.

Example configuration using placeholders only:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/task-manager?retryWrites=true&w=majority&authSource=admin
PORT=5001
CLIENT_URL=http://127.0.0.1:5174
```

For local MongoDB, use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
PORT=5001
CLIENT_URL=http://127.0.0.1:5174
```

Frontend configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

## Start the application

In **Terminal 1**:

```powershell
cd "D:\AllProjects\codewise assignment\backend"
npm run dev
```

Expected backend URL:

```text
http://127.0.0.1:5001
```

In **Terminal 2**:

```powershell
cd "D:\AllProjects\codewise assignment\frontend"
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5174/
```

Vite may select another port if 5174 is occupied. If that happens, update `CLIENT_URL` and `VITE_API_BASE_URL` to match the displayed URLs.

## API documentation

Responses use either `{ "success": true, "data": ... }` or `{ "success": false, "message": "..." }`. The `/tasks` routes and `/api/tasks` aliases are both supported.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/tasks` or `/api/tasks` | Create a task |
| GET | `/tasks` or `/api/tasks` | List tasks |
| GET | `/tasks/:id` or `/api/tasks/:id` | Get one task |
| PUT | `/tasks/:id` or `/api/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` or `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

Task fields:

```json
{
  "title": "Prepare demo",
  "description": "Review the dashboard",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-12-01"
}
```

Example PowerShell request:

```powershell
$task = Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:5001/tasks" `
  -ContentType "application/json" `
  -Body '{"title":"Prepare demo","priority":"high","status":"todo"}'
$task
```

Filtering and sorting:

```text
GET /tasks?status=todo
GET /tasks?status=in_progress
GET /tasks?status=done
GET /tasks?sortBy=dueDate&sortOrder=asc
GET /tasks?sortBy=dueDate&sortOrder=desc
GET /tasks?sortBy=priority&sortOrder=asc
GET /tasks?sortBy=priority&sortOrder=desc
```

Priority order is semantic: low, medium, high. Tasks without due dates are placed after dated tasks.

## Testing

Run the backend integration suite without local MongoDB:

```powershell
cd "D:\AllProjects\codewise assignment\backend"
npm test
```

The suite covers both route aliases, CRUD, persistence across requests, validation, malformed/nonexistent IDs, filtering, date sorting, priority sorting, missing dates, and JSON errors.

Build the frontend:

```powershell
cd "D:\AllProjects\codewise assignment\frontend"
npm run build
```

## Troubleshooting

- **MongoDB connection refused:** start local MongoDB or replace `MONGO_URI` with your own Atlas URI and allow your IP in Atlas Network Access.
- **Atlas authentication failed:** verify the database username, password, `readWrite` role, and `authSource=admin`.
- **API unavailable in the browser:** confirm the backend is listening on port 5001 and `VITE_API_BASE_URL` ends with `/api`.
- **CORS error:** set `CLIENT_URL` to the exact frontend origin, including its port.
- **Port in use:** change `PORT`, then update `VITE_API_BASE_URL` and `CLIENT_URL`.
- **Tests need no local database:** `npm test` starts an isolated MongoDB Memory Server automatically.
