const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    // console.log('User found:', user); // Debugging line
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
