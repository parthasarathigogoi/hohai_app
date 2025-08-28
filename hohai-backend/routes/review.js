const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// @route   POST api/reviews
// @desc    Create a new review
// @access  Private (Authenticated user)
router.post('/', auth, reviewController.createReview);

// @route   GET api/reviews/service/:serviceId
// @desc    Get all reviews for a specific service
// @access  Public
router.get('/service/:serviceId', reviewController.getReviewsForService);

// @route   GET api/reviews/:id
// @desc    Get a single review by ID
// @access  Public
router.get('/:id', reviewController.getReviewById);

// @route   PUT api/reviews/:id
// @desc    Update a review
// @access  Private (Owner of the review)
router.put('/:id', auth, reviewController.updateReview);

// @route   DELETE api/reviews/:id
// @desc    Delete a review
// @access  Private (Owner of the review)
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;