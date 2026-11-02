# Assessment Notes

## 1. Supporting multiple users and private task lists

I would add a `User` model and a `userId` reference on `Task`, then authenticate requests with JWTs. Every query and mutation would be scoped to the authenticated user, with authorization checks preventing access to another user's tasks.

## 2. Scaling to thousands of tasks

The first concern would be fetching and rendering the entire collection on every request. I would add server-side pagination, indexes for status/owner/due-date queries, and return only the records and fields needed by the current page.

## 3. AI coding tools — draft for review and personalization

**DRAFT — please review and personalize before submission.** During development, testing exposed that the initial priority sort was alphabetical rather than low → medium → high. I changed the implementation to use explicit semantic priority ordering and added automated coverage for both sort directions instead of accepting the initial behavior.
