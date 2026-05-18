require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const createRateLimiter = require('./middleware/rateLimiter');

const requiredEnv = ['JWT_SECRET'];
for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

const globalRateLimiter = createRateLimiter({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 60 * 1000,
  maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) : 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(globalRateLimiter);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('API Access Management System Running');
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT.`);
        process.exit(1);
    }

    console.error('Server failed to start:', err);
    process.exit(1);
});