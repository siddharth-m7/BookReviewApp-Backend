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


exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('book', 'title author');

    res.json({
      user: {
        name: req.user.name,
        email: req.user.email,
        _id: req.user._id,
      },
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not your review' });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    // Update book average
    const reviews = await Review.find({ book: review.book });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Book.findByIdAndUpdate(review.book, { averageRating: avg.toFixed(1) });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not your review' });

    await review.deleteOne();

    // Update average rating
    const reviews = await Review.find({ book: review.book });
    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await Book.findByIdAndUpdate(review.book, { averageRating: avg.toFixed(1) });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

