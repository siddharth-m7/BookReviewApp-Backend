const express = require('express');
const router = express.Router();
const { addReview, getMyReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

router.post('/:bookId', authMiddleware, addReview);
router.get('/my', authMiddleware, getMyReviews);

module.exports = router;
