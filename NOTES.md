# Assessment Notes

## 1. Supporting Multiple Users and Private Task Lists

I would introduce a `User` model and add a `userId` reference to each Task document. I would implement JWT-based authentication and scope every task query and mutation to the authenticated user, with authorization checks preventing users from accessing another user's tasks.

## 2. Scaling to Thousands of Tasks

My first concern would be fetching and rendering the entire task collection on every request. I would introduce server-side pagination, add appropriate MongoDB indexes for frequently queried fields such as status, owner, and due date, and return only the records and fields required for the current page.

## 3. AI Coding Tools

I used GitHub Copilot as an AI-assisted coding tool. During testing, I identified that the initial priority sorting was alphabetical rather than following the required Low → Medium → High order, so I changed it to use explicit priority mapping and added automated tests to verify both ascending and descending sorting.
