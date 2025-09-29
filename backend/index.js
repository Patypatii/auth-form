
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';


const app = express();
app.use(cors());
app.use(express.json());

// NeonDB connection
console.log('Connecting to NeonDB...');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
console.log('Connected to NeonDB');

// Auto-create users table if not exists
const initPath = path.resolve(process.cwd(), 'init.sql');
try {
    const initSql = fs.readFileSync(initPath, 'utf8');
    pool.query(initSql)
        .then(() => console.log('Checked/created users table'))
        .catch(e => console.error('Error running init.sql:', e));
} catch (e) {
    console.error('Could not read init.sql:', e);
}

// Nodemailer SMTP setup for Gmail
console.log('Setting up Nodemailer SMTP transport for Gmail...');
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});
console.log('Gmail SMTP transport ready');

const sender = process.env.GMAIL_USER;

// Helper: send verification email
async function sendVerificationEmail(email, name) {
    console.log(`Sending verification email to ${email}...`);
        const html = `
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 0;min-height:100vh;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="max-width:420px;margin:40px auto;background:rgba(255,255,255,0.95);border-radius:18px;box-shadow:0 8px 32px rgba(99,102,241,0.12);padding:40px 32px;text-align:center;">
                <div style="margin-bottom:24px;">
                    <img src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png' alt='User Icon' width='64' height='64' style='border-radius:50%;box-shadow:0 2px 8px #06b6d4,0 0 0 8px #fff;'>
                </div>
                <h2 style="color:#6366f1;font-size:2rem;margin-bottom:8px;">Welcome, ${name}!</h2>
                <p style="color:#444;font-size:1.1rem;margin-bottom:32px;">Thank you for signing up to <b>Glassmorphism Auth App</b>.<br>To complete your registration, please verify your email address.</p>
                <a href="#" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#6366f1 0%,#06b6d4 100%);color:#fff;font-weight:600;border-radius:8px;text-decoration:none;font-size:1.1rem;box-shadow:0 4px 15px rgba(99,102,241,0.18);margin-bottom:24px;">Verify Email</a>
                <p style="color:#888;font-size:0.95rem;margin-top:32px;">If you did not create this account, you can safely ignore this email.<br><br>Best regards,<br><b>Patrick Wambugu</b> Team</p>
            </div>
        </div>
        `;
        await mailTransport.sendMail({
                from: sender,
                to: email,
                subject: 'Verify your account',
                text: `Hello ${name},\n\nThank you for signing up! Please verify your account.`,
                html
        });
        console.log(`Verification email sent to ${email}`);
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    console.log('POST /api/signup', req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        console.log('Signup failed: missing fields');
        return res.status(400).json({ error: 'All fields required' });
    }
    // Check if email already exists
    try {
        const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            console.log('Signup failed: email already registered');
            return res.status(400).json({ error: 'Email already registered. Please use a different email or login.' });
        }
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, hash]
        );
        console.log('User created:', result.rows[0]);
        await sendVerificationEmail(email, name);
        const token = jwt.sign({ id: result.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (e) {
        console.error('Signup error:', e);
        res.status(400).json({ error: 'Signup failed. Please try again.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    console.log('POST /api/login', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Login failed: missing fields');
        return res.status(400).json({ error: 'All fields required' });
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length) {
        console.log('Login failed: user not found');
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        console.log('Login failed: password mismatch');
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for', email);
    res.json({ token });
});

// Dashboard (protected)
app.get('/api/dashboard', (req, res) => {
    console.log('GET /api/dashboard');
    const auth = req.headers.authorization;
    if (!auth) {
        console.log('Dashboard access denied: no token');
        return res.status(401).json({ error: 'No token' });
    }
    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        console.log('Dashboard access granted for', decoded.email);
        res.json({ message: `Welcome, user ${decoded.email}` });
    } catch (e) {
        console.log('Dashboard access denied: invalid token');
        res.status(401).json({ error: 'Invalid token' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on ' + PORT));
