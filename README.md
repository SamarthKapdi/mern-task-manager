# Personal Task Manager

A clean, responsive, full-stack task management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Organize tasks, manage priorities, track deadlines, and monitor your productivity through a modern dashboard.

## Overview

Personal Task Manager helps users create, organize, update, filter, sort, and track their daily tasks through a simple and intuitive interface.

The application uses MongoDB for persistent storage, an Express.js REST API for backend operations, and React for an interactive frontend.

All task data is retrieved from the backend and persisted in MongoDB. The application does not rely on hardcoded mock task data.

## Features

### Task Management
- Create tasks with title, description, priority, status, and due date.
- Edit existing tasks through a centered modal dialog.
- Delete tasks with confirmation.
- Update task status directly from task cards.
- Automatically synchronize the interface with backend data.

### Dashboard
- Overview of total tasks.
- Todo, in-progress, and completed task counts.
- Completion progress indicator.
- Clean and responsive dashboard layout.

### Search, Filtering & Sorting
- Search tasks by title and description.
- Filter tasks by Todo, In Progress, and Done.
- Sort tasks by due date.
- Sort tasks by priority.
- Support ascending and descending sorting.
- Combine search, filtering, and sorting.

### Priority & Deadline Tracking
- Low, medium, and high priority indicators.
- Overdue task indicators.
- Due today indicators.
- Upcoming deadline indicators.
- Completed tasks are handled separately from overdue tasks.

### User Experience
- Responsive desktop and mobile layouts.
- Centered edit modal with backdrop.
- Keyboard and Escape-key interaction.
- Accessible task action menus.
- Loading and empty states.
- Success and error feedback.
- Confirmation before deleting tasks.
- Background scrolling prevention while editing.

### Backend & Reliability
- RESTful CRUD API.
- MongoDB persistence using Mongoose.
- Request validation.
- Centralized error-handling middleware.
- Invalid ObjectId handling.
- Proper HTTP status codes.
- Automated backend integration tests.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas / MongoDB |
| ODM | Mongoose |
| API Communication | Axios |
| State Management | React Hooks |
| Environment Configuration | dotenv, Vite environment variables |
| Testing | Vitest, Supertest, MongoDB Memory Server |
| Version Control | Git and GitHub |

## Project Structure

```text
mern-task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateTask.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── tests/
│   │   └── tasks.integration.test.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── README.md
├── NOTES.md
├── .env.example
├── .gitignore
└── LICENSE
```

## Prerequisites

Before running the application, make sure you have:

- Node.js 18 or newer.
- npm.
- Git.
- A MongoDB local instance or MongoDB Atlas account.
- PowerShell or another terminal.

## Getting Started

### 1. Clone the Repository

```powershell
git clone https://github.com/SamarthKapdi/mern-task-manager.git

cd mern-task-manager
```

### 2. Backend Setup

Open the first terminal:

```powershell
cd backend

npm install

Copy-Item .env.example .env
```

Open `backend/.env` and configure your MongoDB connection.

Example:

```env
PORT=5001
CLIENT_URL=http://127.0.0.1:5174
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/task-manager?retryWrites=true&w=majority&authSource=admin
```

Replace the placeholders with your own MongoDB Atlas credentials.

Never commit your actual `.env` file or expose database credentials.

Start the backend:

```powershell
npm run dev
```

The backend should be available at:

```text
http://127.0.0.1:5001
```

### 3. Frontend Setup

Open a second terminal from the project root:

```powershell
cd frontend

npm install

Copy-Item .env.example .env
```

Frontend environment configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

Start the frontend:

```powershell
npm run dev -- --host 127.0.0.1
```

Open the application:

```text
http://127.0.0.1:5174/
```

Note: If the frontend port is already occupied, Vite may select another available port. Configure `CLIENT_URL` and `VITE_API_BASE_URL` to match the actual frontend URL.

## MongoDB Atlas Configuration

To use MongoDB Atlas:

1. Create a MongoDB Atlas account.
2. Create a project and database deployment.
3. Create a database user with password authentication.
4. Assign the `readWrite` role to the application database.
5. Add your current IP address under Network Access.
6. Open Connect and select Drivers.
7. Copy the Node.js connection string.
8. Replace the placeholders in `backend/.env`.

For local MongoDB, use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
```

The application requires a valid MongoDB connection to run its live CRUD operations.

## Task Data Model

Each task contains:

| Field | Type | Description |
|---|---|---|
| title | String | Required task title |
| description | String | Optional task description |
| priority | Enum | low, medium, high |
| status | Enum | todo, in_progress, done |
| dueDate | Date | Optional deadline |
| createdAt | Timestamp | Task creation time |

## REST API Documentation

The backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a specific task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

The `/api/tasks` and `/api/tasks/:id` aliases are also supported.

### Example: Create a Task

Endpoint:

```http
POST /tasks
```

Request body:

```json
{
  "title": "Prepare project submission",
  "description": "Complete documentation and testing",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-12-01"
}
```

### Filtering Examples

```http
GET /tasks?status=todo
GET /tasks?status=in_progress
GET /tasks?status=done
```

### Sorting Examples

```http
GET /tasks?sortBy=dueDate&sortOrder=asc

GET /tasks?sortBy=dueDate&sortOrder=desc

GET /tasks?sortBy=priority&sortOrder=asc

GET /tasks?sortBy=priority&sortOrder=desc
```

Priority sorting follows the intended order:

```text
Low → Medium → High
```

Tasks without due dates are placed after dated tasks.

### API Response Format

Successful responses:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "A clear error message"
}
```

## Testing

The backend includes an integration test suite using Vitest, Supertest, and MongoDB Memory Server.

To execute backend tests:

```powershell
cd backend

npm install

npm test
```

The automated tests cover:

- Task creation, retrieval, update, and deletion.
- Required and optional field validation.
- Invalid priority and status values.
- Invalid dates.
- Malformed and nonexistent task IDs.
- Status filtering.
- Due-date sorting.
- Semantic priority sorting.
- Missing due-date behavior.
- API error responses.
- Persistence across requests.

The test suite uses an isolated in-memory MongoDB instance and does not require a locally running MongoDB server.

### Frontend Production Build

```powershell
cd frontend

npm install

npm run build
```

## Screenshots

Screenshots of the actual running application can be added here.

Suggested screenshots:

- Main dashboard.
- Task creation form.
- Centered edit task modal.
- Search and filtering.
- Responsive mobile dashboard.

Store genuine screenshots in `docs/screenshots/` and reference them using relative Markdown image paths.

## Error Handling

The application handles:

- Empty task titles.
- Invalid priority and status values.
- Invalid MongoDB ObjectIds.
- Tasks that do not exist.
- MongoDB connection errors.
- Failed API requests.
- Loading and empty states.

A centralized error-handling middleware ensures consistent API error responses without exposing raw server stack traces.

## Security & Configuration

- Database credentials are stored in environment variables.
- `.env` files are excluded through `.gitignore`.
- `node_modules/` and build output are excluded from Git.
- `.env.example` files provide placeholder configuration.
- No real database credentials should be committed.

## Future Improvements

Possible extensions include:

- JWT authentication and private user task lists.
- Server-side pagination.
- Advanced task reminders.
- Calendar integration.
- Task collaboration.
- Automated frontend browser testing.

## Repository

GitHub: https://github.com/SamarthKapdi/mern-task-manager

## License

This project is available under the MIT License. See the `LICENSE` file for details.
