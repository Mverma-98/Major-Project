const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required to generate tokens.');
  }

  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    secret,
    {
      expiresIn: '1h'
    }
  );
};

module.exports = generateToken;
