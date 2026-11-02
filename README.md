# Personal Task Manager

A responsive MERN task dashboard for creating, organizing, filtering, sorting, editing, and completing personal tasks. Task data is persisted in MongoDB through an Express API; the client does not use mock task data.

## Features

- CRUD task management with title, description, priority, status, due date, and creation timestamp.
- Dashboard counts for total, todo, in-progress, and completed tasks.
- Status filtering and due-date/priority sorting with ascending/descending order.
- Responsive card-based interface with validation, loading states, empty states, operation feedback, and delete confirmation.
- Centralized API error handling and validation for malformed input, invalid IDs, and missing records.

## Stack and structure

- Frontend: React 18, Vite, Axios, CSS3, React Hooks
- Backend: Node.js, Express, Mongoose, dotenv
- Database: MongoDB

```text
backend/
  config/ controllers/ middleware/ models/ routes/
  server.js package.json
frontend/
  src/components src/hooks src/pages src/services
  src/App.jsx src/index.css src/main.jsx
README.md NOTES.md
```

## Setup

Requirements: Node.js 18+, npm, and a running MongoDB instance (local or Atlas).

1. Install backend dependencies:

   ```powershell
   cd backend
   npm install
   Copy-Item .env.example .env
   ```

2. Set `MONGO_URI`, `PORT`, and `CLIENT_URL` in `backend/.env`. Example:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/task-manager
   PORT=5001
   CLIENT_URL=http://127.0.0.1:5174
   ```

   For MongoDB Atlas, replace `MONGO_URI` with the connection string copied from your own Atlas cluster. Credentials are intentionally not included in this repository:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/task-manager?retryWrites=true&w=majority
   ```

3. Start the API:

   ```powershell
   npm run dev
   ```

4. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open the Vite URL shown in the terminal. To use another API URL, set `VITE_API_URL` in `frontend/.env` (for example `http://127.0.0.1:5001/api`).

## Automated tests

The backend integration suite uses Vitest, Supertest, and MongoDB Memory Server. It does not require a locally installed or running MongoDB server:

```powershell
cd backend
npm test
```

The suite covers CRUD operations, both route aliases, filtering, semantic priority and date sorting, validation, malformed IDs, and missing records.

## API

All responses use `{ "success": boolean, "data": ... }` or `{ "success": false, "message": "..." }`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/tasks` or `/api/tasks` | Create a task |
| GET | `/tasks` or `/api/tasks` | Get tasks; supports `status`, `sortBy=dueDate\|priority`, and `sortOrder=asc\|desc` |
| GET | `/tasks/:id` or `/api/tasks/:id` | Get one task |
| PUT | `/tasks/:id` or `/api/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` or `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

Example create payload:

```json
{"title":"Prepare demo","description":"Review the dashboard","priority":"high","status":"todo","dueDate":"2026-12-01"}
```

## Troubleshooting

- **MongoDB connection failure:** confirm MongoDB is running and `MONGO_URI` is correct. If Docker Desktop or local MongoDB is unavailable, use your own MongoDB Atlas connection string; the backend exits clearly rather than serving without persistence.
- **Network/API errors:** ensure the backend is listening on port 5001 and that the frontend `VITE_API_URL` points to `/api`.
- **CORS errors:** set `CLIENT_URL` to the exact frontend origin.
- **Port in use:** change `PORT`, then update `VITE_API_URL` accordingly.
