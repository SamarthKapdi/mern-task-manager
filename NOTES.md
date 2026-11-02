# Assessment Notes

## 1. Supporting multiple users and private task lists

I would add a `User` model and an `owner` ObjectId field on `Task` referencing that user. Authentication (for example, short-lived access tokens with refresh tokens) would establish the authenticated user on every request. Controllers would always scope queries and writes by `owner`, and an index on `{ owner: 1, status: 1, dueDate: 1 }` would support the most common private-list queries.

## 2. Scaling to thousands of tasks

The first concern would be returning and rendering the entire collection for every request. I would add server-side pagination with `page` and `limit`, return a small metadata object (`total`, `page`, `pages`), add indexes for filter/sort combinations, and use a paginated UI that loads only the visible page.

## 3. AI coding tools (draft to review and personalize)

**DRAFT — please review and personalize before submission.**

I used an AI coding assistant to accelerate scaffolding and review during this assessment. I treated its output as a starting point, then checked the implementation against the assignment requirements and adjusted validation, error handling, API response consistency, and UI loading/error states where needed. I did not accept generated code without reviewing its behavior.
