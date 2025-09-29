# Modern Glassmorphism Auth App

A full-stack authentication system with a beautiful glassmorphism UI, built with Node.js, Express, PostgreSQL (NeonDB), and vanilla JS/CSS. Features login, signup, JWT auth, email verification (Mailtrap), and a modern dashboard.

## Features
- Glassmorphism login & signup forms with floating labels, animations, and password toggle
- Password strength meter and real-time validation
- Secure backend with JWT, bcrypt, and PostgreSQL (NeonDB)
- Email verification via Mailtrap
- Toast notifications for errors and success
- Responsive, accessible, and modern UI
- Social login button placeholders (Google, GitHub)
- Dashboard with matching glassmorphism style

## Setup

### 1. Backend
- `cd backend`
- `npm install`
- Copy `.env.example` to `.env` and fill in your NeonDB and Mailtrap credentials
- Start server: `npm start`
- The backend will auto-create the `users` table if it doesn't exist

### 2. Database
- NeonDB is used (see `.env` for connection string)
- Table schema is in `backend/init.sql` (auto-applied on server start)

### 3. Frontend
- Open `frontend/index.html` in your browser
- For local API, ensure backend runs on `localhost:4000`

## Usage
- Sign up with a new email and strong password
- Login with your credentials
- On success, you'll be redirected to the dashboard
- Errors and notifications appear as toasts

## Customization
- Edit `frontend/style.css` for UI tweaks
- Edit `backend/index.js` for backend logic
- Add your own social login logic if needed

## Tech Stack
- Node.js, Express, PostgreSQL (NeonDB), JWT, bcrypt, Nodemailer/Mailtrap
- HTML, CSS (glassmorphism), JavaScript (vanilla)

## License
MIT
