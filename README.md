# NoteSphere

NoteSphere is a full-stack academic resource sharing platform built with React, Vite, Tailwind CSS, Express, and SQLite.

## Project layout

- `frontend/` - React and Vite application
- `backend/server/` - Express API, routes, controllers, services, and tests
- `backend/server/database/` - SQLite access, schema, seed data, and database files
- `backend/server/auth/` - JWT authentication middleware and server auth handlers
- `auth/frontend/` - Login, signup, password reset pages, and auth API client

## Development

Install dependencies in the project root and backend package, then run:

```bash
npm run dev
npm run dev:server
```

The frontend runs through Vite and the API runs on the backend server port configured by the project environment.

## Validation

```bash
npm run build
npm test
```

The test suite covers health checks, authentication, resources, community feeds, notifications, admin authorization, and versioned resource interactions.
