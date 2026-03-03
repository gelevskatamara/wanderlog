# 🌍 WanderLog — Travel Journal & Trip Planner

A full-stack MERN application for logging trips, exploring countries, checking live weather, and managing your travel journal.

## Tech Stack

- **Frontend**: React 18, React Router v6, Recharts, Axios
- **Backend**: Node.js, Express 4, Mongoose
- **Database**: MongoDB
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **External APIs**: REST Countries API, OpenWeatherMap API
- **Email**: Nodemailer
- **Docs**: Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Dev**: Docker + docker-compose

## Quick Start (Docker)

```bash
# Clone and start everything
docker-compose up --build
```

Then open:
- App: http://localhost:3000
- API: http://localhost:5000
- Swagger docs: http://localhost:5000/api/docs
- DB tools: http://localhost:5000/db

## Local Dev (without Docker)

```bash
# Backend
cd backend
cp .env.example .env    # fill in your values
npm install
npm run dev             # runs on :5000

# Frontend (new terminal)
cd frontend
npm install
npm start               # runs on :3000
```

## Seed Data

Visit http://localhost:5000/db/seed to create sample data.

Default credentials after seed:
| Email | Password | Role |
|-------|----------|------|
| admin@wanderlog.com | admin123 | admin |
| alex@wanderlog.com | user123 | user |
| maria@wanderlog.com | user123 | user |

## Sync Countries

Log in as admin, then POST `/api/countries/sync` (or use Swagger UI) to populate all 195 countries from REST Countries API.

## User Roles

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| Browse countries | ✅ | ✅ | ✅ |
| View weather | ✅ | ✅ | ✅ |
| Log trips | ❌ | ✅ | ✅ |
| Write reviews | ❌ | ✅ | ✅ |
| Delete own content | ❌ | ✅ | ✅ |
| Delete any content | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Admin panel | ❌ | ❌ | ✅ |

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | User |
| GET | /api/trips | User |
| POST | /api/trips | User |
| PUT | /api/trips/:id | Owner/Admin |
| DELETE | /api/trips/:id | Owner/Admin |
| GET | /api/countries | Public |
| POST | /api/countries/sync | Admin |
| GET | /api/weather/:city | Public |
| POST | /api/reviews | User |
| GET | /api/admin/stats | Admin |
| GET | /api/admin/users | Admin |

Full docs at `/api/docs/`

## MongoDB Collections

1. **Users** — auth, roles, profile
2. **Trips** — dependent on Users (userId ref)
3. **Reviews** — dependent on both Users and Trips
4. **Countries** — synced from REST Countries API
5. **Notifications** — dependent on Users

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wanderlog
MONGO_URI_PROD=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=app_password
OPENWEATHER_API_KEY=your_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```
