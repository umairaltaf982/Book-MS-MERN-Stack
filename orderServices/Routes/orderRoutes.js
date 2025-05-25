const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');

// Create new order
router.post('/', orderController.createOrder);

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);

// Get user orders
router.get('/user/:userId', orderController.getUserOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Update payment status
router.patch('/:id/payment', orderController.updatePaymentStatus);

// Cancel order
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
