const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// @route   POST api/payments/process
// @desc    Process a payment
// @access  Private (Customer only)
router.post('/process', auth, paymentController.processPayment);

// @route   GET api/payments/:id
// @desc    Get payment details by ID
// @access  Private (Customer or Service Provider involved in the payment)
router.get('/:id', auth, paymentController.getPaymentById);

module.exports = router;