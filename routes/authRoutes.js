const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/admin-data', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: 'Only admins can see this' });
});

const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful on client' });
});


module.exports = router;
