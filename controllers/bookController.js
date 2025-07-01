const Book = require('../models/Book');

// Get all books(public)
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('createdBy', 'name email');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' } // nested populate
      });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create book
exports.createBook = async (req, res) => {
  const { title, author, description } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      description,
      createdBy: req.user.id
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Admin: Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};