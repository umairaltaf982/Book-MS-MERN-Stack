const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/add-to-cart', authMiddleware.protectUser, userController.addToCart);
router.put('/remove-from-cart', authMiddleware.protectUser, userController.removeFromCart);
router.put('/add-to-wishlist', authMiddleware.protectUser, userController.addToWishlist);
router.put('/remove-from-wishlist', authMiddleware.protectUser, userController.removeFromWishlist);
router.put('/buy-book', authMiddleware.protectUser, userController.buyBook);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.verifyOtpAndResetPassword);
router.get('/get-cart', authMiddleware.protectUser, userController.getCart);

module.exports = router;
