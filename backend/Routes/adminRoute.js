const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/create-book', authMiddleware.protectAdmin, adminController.createBook);
router.put('/update-book/:id', authMiddleware.protectAdmin, adminController.updateBook);
router.delete('/delete-book/:id', authMiddleware.protectAdmin, adminController.deleteBook);
router.get('/get-all-books', authMiddleware.protectAdmin, adminController.getAllBooks);
router.get('/get-all-users', authMiddleware.protectAdmin, adminController.getAllUsers);
router.delete('/delete-user/:id', authMiddleware.protectAdmin, adminController.deleteUser);
router.put('/update-user/:id', authMiddleware.protectAdmin, adminController.updateUser);
router.post('/add-contact', adminController.addContact);

module.exports = router;