# Notes Test

The test application for for Notes project, acts as a test client for `note-backend` and `note-id`.

# Environment variables

| Name        | Description       | Example               |
| ----------- | ----------------- | --------------------- |
| BASE_ID_URL | Notes ID URL      | http://localhost:3001 |
| BASE_BE_URL | Notes backend URL | http://localhost:3000 |

# Commands

-   `npm run apitest` runs API test and reports when failed
-   `npm run login <username> <password>` performs login and prints JWT token
-   `npm run listnotes <username> <password>` prints all notes for <username>
