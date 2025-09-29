# Modern Glassmorphism Auth App

A full-stack authentication system with a beautiful glassmorphism UI, built with Node.js, Express, PostgreSQL (NeonDB), and vanilla JS/CSS. Features login, signup, JWT auth, email verification (Gmail SMTP), and a modern dashboard. Now deployable as a static frontend on GitHub Pages.

## Features
- Glassmorphism login & signup forms with floating labels, animations, and password toggle
- Password strength meter and real-time validation
- Secure backend with JWT, bcrypt, and PostgreSQL (NeonDB)
- Email verification via Gmail SMTP
- Toast notifications for errors and success
- Responsive, accessible, and modern UI
- Social login button placeholders (Google, GitHub)
- Dashboard with matching glassmorphism style
- PWA support (manifest, icons, favicon)
- Static frontend deployable to GitHub Pages (`docs/` folder)

## Setup

### 1. Backend
- `cd backend`
- `npm install`
- Copy `.env.example` to `.env` and fill in your NeonDB and Gmail SMTP credentials (see below)
- Start server: `npm start`
- The backend will auto-create the `users` table if it doesn't exist

#### .env Example
```
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

### 2. Database
- NeonDB is used (see `.env` for connection string)
- Table schema is in `backend/init.sql` (auto-applied on server start)

### 3. Frontend (Local)
- Open `frontend/index.html` in your browser
- For local API, ensure backend runs on `localhost:4000`

### 4. Frontend (GitHub Pages)
- All static files are in the `docs/` folder
- Push to your repository and enable GitHub Pages (set source to `docs/`)
- Update API URLs in JS if your backend is not public

## Usage
- Sign up with a new email and strong password
- Login with your credentials
- On success, you'll be redirected to the dashboard
- Errors and notifications appear as toasts

## Customization
- Edit `frontend/style.css` or `docs/style.css` for UI tweaks
- Edit `backend/index.js` for backend logic
- Add your own social login logic if needed
- Update `docs/site.webmanifest` for PWA details

## Tech Stack
- Node.js, Express, PostgreSQL (NeonDB), JWT, bcrypt, Nodemailer/Gmail SMTP
- HTML, CSS (glassmorphism), JavaScript (vanilla)

## License
MIT
