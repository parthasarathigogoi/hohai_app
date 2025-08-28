const Review = require('../models/Review');
const Service = require('../models/Service');

// Create a new review
exports.createReview = async (req, res) => {
    const { serviceId, rating, comment } = req.body;

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        const newReview = new Review({
            user: req.user.id, // Assuming user ID is available from authentication middleware
            service: serviceId,
            rating,
            comment
        });

        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all reviews for a service
exports.getReviewsForService = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
            .populate('user', ['email'])
            .populate('service', ['name']);
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', ['email'])
            .populate('service', ['name']);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Ensure user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Ensure user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await review.remove();
        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};