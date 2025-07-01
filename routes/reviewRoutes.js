const express = require('express');
const router = express.Router();
const { addReview, getMyReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:bookId', authMiddleware, addReview);
router.get('/my', authMiddleware, getMyReviews);

module.exports = router;
