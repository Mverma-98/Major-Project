const express = require('express');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const createRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 15,
  message: 'Too many login attempts. Please wait before retrying.'
});

const users = [
  {
    id: 1,
    username: 'Admin',
    password: bcrypt.hashSync('Admin123', 10),
    role: 'Admin'
  },
  {
    id: 2,
    username: 'User_PROD',
    password: bcrypt.hashSync('Prod123', 10),
    role: 'User_PROD'
  },
  {
    id: 3,
    username: 'User_Guest',
    password: bcrypt.hashSync('Guest123', 10),
    role: 'User_Guest'
  }
];

router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required.'
      });
    }

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
      message: 'Login failed. Please try again later.'
    });
  }
});

module.exports = router;
