# WorkBridge — Job Portal (MERN Stack)

Full-stack job portal with JWT auth, role-based access (job seeker / recruiter),
job posting, resume-upload applications, and application status tracking.

## Tech stack
- **Frontend:** React, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas or local) via Mongoose
- **Auth:** JWT + bcrypt password hashing
- **File uploads:** Multer (resumes)

## Project structure
```
job-portal/
  backend/
    config/db.js
    models/        User.js, Job.js, Application.js
    middleware/     authMiddleware.js, roleMiddleware.js, uploadMiddleware.js
    controllers/    authController.js, jobController.js, applicationController.js
    routes/         authRoutes.js, jobRoutes.js, applicationRoutes.js
    server.js
  frontend/
    src/
      api/axios.js
      context/AuthContext.js
      components/  Navbar.js, PrivateRoute.js, JobCard.js
      pages/       Login, Register, JobList, JobDetails, PostJob,
                    RecruiterDashboard, Applicants, MyApplications
      App.js
```

## 1. Set up MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow your IP (or 0.0.0.0/0 for dev)
3. Copy the connection string — you'll paste it into `backend/.env`

## 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET
npm run dev
```
Backend runs on `http://localhost:5000`.

## 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs elsewhere
npm start
```
Frontend runs on `http://localhost:3000`.

## 4. Try it out
1. Register as a **recruiter** → post a job.
2. Register as a **job seeker** (separate browser/incognito) → apply with a resume file.
3. Back in the recruiter account → open "My postings" → "View applicants" → update status.

## API reference

| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register (seeker or recruiter) |
| POST | /api/auth/login | Public | Log in, returns JWT |
| GET  | /api/auth/me | Private | Current user |
| GET  | /api/jobs | Public | List jobs (`?search=&location=&type=`) |
| GET  | /api/jobs/:id | Public | Job details |
| GET  | /api/jobs/my/posted | Recruiter | Jobs posted by current recruiter |
| POST | /api/jobs | Recruiter | Create job |
| PUT  | /api/jobs/:id | Recruiter (owner) | Update job |
| DELETE | /api/jobs/:id | Recruiter (owner) | Delete job |
| POST | /api/applications/:jobId | Seeker | Apply (multipart, field `resume`) |
| GET  | /api/applications/my | Seeker | My applications |
| GET  | /api/applications/job/:jobId | Recruiter (owner) | View applicants |
| PUT  | /api/applications/:id/status | Recruiter (owner) | Update application status |

## Deployment notes
- **Backend:** Render / Railway — set env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
  For file storage in production, swap the local `uploads/` disk for Cloudinary or S3,
  since most PaaS filesystems are ephemeral.
- **Frontend:** Vercel / Netlify — set `REACT_APP_API_URL` to your deployed backend URL.

## Resume bullet points (based on this build)
- Built a full-stack Job Portal (MERN) with JWT authentication and role-based
  authorization for job seekers and recruiters.
- Implemented REST APIs for job CRUD, resume-upload applications (Multer), and
  application status tracking, with MongoDB indexes for fast job search.
- Designed a responsive React frontend with protected routes, Context-based
  auth state, and a Tailwind CSS UI.
