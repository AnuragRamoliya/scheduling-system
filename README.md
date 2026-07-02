# Scheduling System

A production-minded Calendly-lite scheduling system built as an npm workspace monorepo.

## Stack

- Backend: Node.js, Express, TypeScript, Sequelize, MySQL 8, JWT, bcrypt, Zod
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Zustand
- Runtime: Docker Compose with `mysql`, `backend`, and `frontend`

## Local Development

1. Copy environment files:

   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start MySQL locally, then run migrations and seeds:

   ```bash
   npm run build -w backend
   npm run db:migrate -w backend
   npm run db:seed -w backend
   ```

4. Run both apps:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:3000` and the backend defaults to `http://localhost:4000`.

Demo login:

- Email: `ada@example.com`
- Password: `DemoPass123!`
- Public link token: `ada-demo-link`

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Compose waits for MySQL health, runs migrations, seeds when `SEED_MODE=true`, starts the API, then serves the frontend with nginx.

## Intentional Dashboard State

The dashboard availability list is intentionally in-memory only. Saving a slot calls `POST /api/availability` and appends the returned slot to a Zustand store. Refreshing the page clears the visible list while MySQL still retains the data.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Availability

Protected by `Authorization: Bearer <token>`.

- `POST /api/availability`
- `GET /api/availability?page=1&limit=50`
- `DELETE /api/availability/:id`

### Booking Links

Protected by `Authorization: Bearer <token>`.

- `POST /api/booking-links/generate`
- `GET /api/booking-links/mine`

### Bookings

Protected by `Authorization: Bearer <token>`.

- `GET /api/bookings?page=1&limit=50`

### Public Booking

- `GET /api/public/:token`
- `GET /api/public/:token/available-dates`
- `GET /api/public/:token/slots?date=YYYY-MM-DD`
- `POST /api/public/:token/book`

All errors use:

```json
{
  "success": false,
  "message": "Readable error",
  "errors": {}
}
```

## Notes

- Public booking endpoints are rate limited.
- Slot generation uses `SLOT_INTERVAL_MINUTES`, defaulting to 30 minutes.
- Booking creation revalidates availability and uses a transaction plus a unique DB index to guard against race conditions.
- Invalid or inactive booking tokens render a real frontend 404 experience.
