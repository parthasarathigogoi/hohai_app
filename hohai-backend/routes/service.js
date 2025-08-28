const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const serviceController = require('../controllers/serviceController');

// @route   POST api/services
// @desc    Create a service
// @access  Private (Service Provider only)
router.post('/', auth, serviceController.createService);

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', serviceController.getAllServices);

// @route   GET api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', serviceController.getServiceById);

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private (Service Provider only)
router.put('/:id', auth, serviceController.updateService);

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Service Provider only)
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;