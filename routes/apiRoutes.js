const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/policyMiddleware');

const router = express.Router();

router.get('/data', authenticateToken, authorize('READ_DATA'), (req, res) => {
  res.json({
    message: 'Protected data accessed successfully',
    user: req.user
  });
});

router.post('/data', authenticateToken, authorize('WRITE_DATA'), (req, res) => {
  res.json({
    message: 'Data written successfully',
    user: req.user
  });
});

router.delete('/data', authenticateToken, authorize('DELETE_DATA'), (req, res) => {
  res.json({
    message: 'Data deleted successfully',
    user: req.user
  });
});

module.exports = router;
