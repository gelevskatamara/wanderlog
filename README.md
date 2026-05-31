# 🌍 WanderLog — Travel Journal & Trip Planner
 
A full-stack MERN web application for planning and logging travel experiences. Explore 195+ countries, track trips, check live weather, upload photos, write reviews, and manage your personal travel journal — all in one place.
 
---
 
## 🔗 Live Demo
 
| | URL |
|---|---|
| **App** | https://wanderlog-front-production.up.railway.app |
| **API Docs** | https://wanderlog-production-bfcd.up.railway.app/api/docs |
 
> **Note:** The app is hosted on Railway's free plan. If it takes 10-15 seconds to load, the server is waking up — this is normal.
 
---
 
## ✨ Features
 
- 🗺️ **Explore Countries** — 250 countries with capitals, currencies, languages, drive side, calling codes
- 🌤️ **Live Weather** — Real-time weather for any country's capital via OpenWeatherMap
- 📸 **Country Photos** — Beautiful landscape photos via Unsplash API
- ✈️ **Trip Management** — Create, edit, delete trips with status tracking (Planned/Ongoing/Completed)
- 🖼️ **Photo Gallery** — Upload up to 10 photos per trip with lightbox viewer
- ⭐ **Reviews** — Star ratings and comments for completed trips
- 👥 **Guest Invitations** — Invite other users to view your trips (read-only access)
- 📊 **Dashboard** — Charts and statistics for your travel history
- 👤 **Profile** — Avatar upload, bio, password management
- 🔐 **3 User Roles** — Guest, User, Admin with role-based access control
- 🛡️ **Admin Panel** — Manage users, view all trips, platform statistics
- 📧 **Email Notifications** — Welcome email and trip notifications via Nodemailer
- 📱 **Fully Responsive** — Mobile-first design, tested in Firefox, Chrome, Edge
- 🍪 **Cookie Consent** — GDPR-style cookie consent banner
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, Axios, Tailwind CSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Email | Nodemailer |
| API Docs | Swagger (swagger-jsdoc, swagger-ui-express) |
| DevOps | Docker, docker-compose |
| Hosting | Railway (backend + frontend), MongoDB Atlas |
| External APIs | REST Countries, OpenWeatherMap, Unsplash |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- npm
### Local Development (without Docker)
 
**1. Clone the repository**
```bash
git clone https://github.com/gelevskatamara/wanderlog.git
cd wanderlog
git checkout develop
```
 
**2. Backend setup**
```bash
cd backend
cp .env.example .env
# Edit .env with your values (see Environment Variables section)
npm install
npm run dev
# Backend runs on http://localhost:5000
```
 
**3. Frontend setup** (new terminal)
```bash
cd frontend
cp .env.example .env
# Edit .env — set REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
# Frontend runs on http://localhost:3000
```
 
**4. Seed the database**
```
http://localhost:5000/db/seed
```
 
**5. Sync countries** (login as admin first, then use Swagger)
```
POST http://localhost:5000/api/countries/sync
```
Or use Swagger UI at `http://localhost:5000/api/docs`
 
---
 
### Docker (single command)
 
```bash
# From the root of the project
docker-compose up --build
```
 
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/api/docs |
| DB Tools | http://localhost:5000/db |
 
---
 
## 🔑 Environment Variables
 
### Backend (`backend/.env`)
 
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | Yes |
| `MONGO_URI` | Local MongoDB connection string | Yes |
| `MONGO_URI_PROD` | MongoDB Atlas connection string | Production |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRE` | JWT expiry (e.g. `7d`) | Yes |
| `EMAIL_HOST` | SMTP host (`smtp.gmail.com`) | Optional |
| `EMAIL_PORT` | SMTP port (`587`) | Optional |
| `EMAIL_USER` | Gmail address | Optional |
| `EMAIL_PASS` | Gmail App Password | Optional |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | Optional |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key | Optional |
| `NODE_ENV` | `development` or `production` | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
 
### Frontend (`frontend/.env`)
 
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API URL (e.g. `http://localhost:5000/api`) |
 
---
 
## 👤 Test Credentials
 
After running `/db/seed`:
 
| Email | Password | Role |
|-------|----------|------|
| admin@wanderlog.com | admin123 | Admin |
| alex@wanderlog.com | user123 | User |
| maria@wanderlog.com | user123 | User |
 
---
 
## 👥 User Roles
 
| Feature | Guest | User | Admin |
|---------|:-----:|:----:|:-----:|
| Browse countries & weather | ✅ | ✅ | ✅ |
| View invited trips | ✅ | ✅ | ✅ |
| Create & manage trips | ❌ | ✅ | ✅ |
| Upload photos & write reviews | ❌ | ✅ | ✅ |
| Invite guests to trips | ❌ | ✅ | ✅ |
| Admin panel | ❌ | ❌ | ✅ |
| Manage users & all trips | ❌ | ❌ | ✅ |
| Sync country data | ❌ | ❌ | ✅ |
 
---
 
## 📁 Project Structure
 
```
wanderlog/
├── backend/
│   ├── config/          # DB, Swagger, Email config
│   ├── middleware/       # Auth, error handling, file upload
│   ├── models/          # Mongoose schemas (6 collections)
│   ├── routes/          # Express route handlers
│   ├── public/          # Static HTML wireframes (Part 1) + uploaded files
│   ├── server.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # AuthContext
│   │   ├── hooks/       # useForm, useCountryPhoto
│   │   ├── pages/       # One component per screen
│   │   └── services/    # Axios API layer
│   ├── public/          # Static assets
│   ├── .env.example
│   └── Dockerfile
└── docker-compose.yml
```
 
---
 
## 🗄️ Database Collections
 
| Collection | Description |
|------------|-------------|
| Users | Authentication, roles, profile, avatar |
| Trips | Trip data with guest invitation support |
| Reviews | Star ratings and comments |
| Countries | Synced from REST Countries API |
| Notifications | System notifications |
| TripPhotos | Gallery photo metadata |
 
---
 
## 📖 API Documentation
 
Interactive Swagger UI available at:
- **Local:** http://localhost:5000/api/docs
- **Production:** https://wanderlog-production-bfcd.up.railway.app/api/docs
OpenAPI spec (JSON): `/api/swagger.json`
 
---
 
## 🧪 Input Validation Rules
 
All fields are validated on three levels: Mongoose schema, Express middleware, and React client.
 
| Field | Rules |
|-------|-------|
| Name | Letters and spaces only, min 2 characters |
| Email | Valid email format (`\S+@\S+\.\S+`) |
| Password | Minimum 8 characters |
| Trip Title | Minimum 3 characters |
| Destination | Letters and spaces only |
| End Date | Must be on or after start date |
| Description | Maximum 500 characters |
 
---
 
## ⚙️ Known Limitations
 
- **Image storage:** Photos are stored on the server filesystem. In production, this should be migrated to Cloudinary or AWS S3 to survive redeployment.
- **Unsplash rate limit:** Free tier allows 50 requests/hour. A request queue with in-memory caching is implemented to handle this.
- **Cold starts:** Railway's free plan sleeps inactive services. Expect 10-15s load time after inactivity.
- **Country sync:** Must be run manually by an admin after first deployment via `/api/countries/sync`.
---
 
## 📚 Academic Context
 
This project was developed as part of the **Web Programming 2026** course assignment, covering:
- Part 1: Static HTML wireframes
- Part 2: MVC architecture + Docker
- Part 3: REST API + MongoDB
- Part 4: React SPA + JWT authentication
---
 
*WanderLog — Travel Journal & Trip Planner | Web Programming 2026*