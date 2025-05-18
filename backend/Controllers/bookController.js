const Book = require('../Models/Book');

const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book found',
            book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getBooks = async (_, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            message: 'Books found',
            books
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const searchBooks = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Create a regex for case-insensitive search
        const searchRegex = new RegExp(query, 'i');

        // Search in title and author fields
        const books = await Book.find({
            $or: [
                { title: searchRegex },
                { author: searchRegex },
                { category: searchRegex }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Search results',
            books
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getBook,
    getBooks,
    searchBooks
}
