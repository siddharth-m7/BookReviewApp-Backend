const Review = require('../models/Review');

// Add a review to a book
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.bookId;

  try {
    const review = await Review.create({
      rating,
      comment,
      user: req.user.id,
      book: bookId
    });

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
