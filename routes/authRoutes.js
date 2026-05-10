const express = require('express');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const router = express.Router();

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

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

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
});

module.exports = router;
