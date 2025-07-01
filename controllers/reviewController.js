const Book = require('../models/Book');
const Review = require('../models/Review');

// Add review
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.bookId;

  try {
    // Save the review
    const review = await Review.create({
      rating,
      comment,
      user: req.user.id,
      book: bookId
    });

    // Recalculate average rating
    const reviews = await Review.find({ book: bookId });
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, { averageRating: average.toFixed(1) });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get all reviews of the logged-in user
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('book', 'title author');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
