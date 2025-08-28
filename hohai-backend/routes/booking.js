const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private (Customer only)
router.post('/', auth, bookingController.createBooking);

// @route   GET api/bookings
// @desc    Get all bookings for the authenticated user (customer or service provider)
// @access  Private
router.get('/', auth, bookingController.getBookings);

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Service Provider only)
router.put('/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router;