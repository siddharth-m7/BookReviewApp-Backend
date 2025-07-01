const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook
} = require('../controllers/bookController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Admin only
router.post('/', authMiddleware, adminMiddleware, createBook);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
