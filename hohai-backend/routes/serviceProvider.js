const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const serviceProviderController = require('../controllers/serviceProviderController');

// @route   POST api/service-providers
// @desc    Create or update service provider profile
// @access  Private
router.post('/', auth, serviceProviderController.createServiceProviderProfile);

// @route   GET api/service-providers
// @desc    Get all service providers
// @access  Public
router.get('/', serviceProviderController.getAllServiceProviders);

// @route   GET api/service-providers/:id
// @desc    Get service provider by ID
// @access  Public
router.get('/:id', serviceProviderController.getServiceProviderById);

// @route   PUT api/service-providers
// @desc    Update service provider profile
// @access  Private
router.put('/', auth, serviceProviderController.updateServiceProviderProfile);

// @route   DELETE api/service-providers
// @desc    Delete service provider profile
// @access  Private
router.delete('/', auth, serviceProviderController.deleteServiceProviderProfile);

module.exports = router;