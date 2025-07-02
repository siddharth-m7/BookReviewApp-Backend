const jwt = require('jsonwebtoken');
const User = require('../models/User'); // make sure path is correct

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password'); // ✅ fetch from DB
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // ✅ now req.user has name, email, role, etc.
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
