const express = require('express');
const router = express.Router();
const bookController = require('../Controllers/bookController');

router.get('/get-book/:id', bookController.getBook);
router.get('/get-all-books', bookController.getBooks);
router.get('/search', bookController.searchBooks);

module.exports = router;
