const ServiceProvider = require('../models/ServiceProvider');

// Create Service Provider Profile
exports.createServiceProviderProfile = async (req, res) => {
    const { companyName, description, servicesOffered, contactNumber, address } = req.body;

    try {
        const newServiceProvider = new ServiceProvider({
            user: req.user.id, // Assuming user ID is available from authentication middleware
            companyName,
            description,
            servicesOffered,
            contactNumber,
            address
        });

        const serviceProvider = await newServiceProvider.save();
        res.json(serviceProvider);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Service Providers
exports.getAllServiceProviders = async (req, res) => {
    try {
        const serviceProviders = await ServiceProvider.find().populate('user', ['email', 'userType']);
        res.json(serviceProviders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Service Provider by ID
exports.getServiceProviderById = async (req, res) => {
    try {
        const serviceProvider = await ServiceProvider.findById(req.params.id).populate('user', ['email', 'userType']);

        if (!serviceProvider) {
            return res.status(404).json({ msg: 'Service Provider not found' });
        }

        res.json(serviceProvider);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Service Provider Profile
exports.updateServiceProviderProfile = async (req, res) => {
    const { companyName, description, servicesOffered, contactNumber, address, isVerified } = req.body;

    // Build service provider object
    const serviceProviderFields = {};
    if (companyName) serviceProviderFields.companyName = companyName;
    if (description) serviceProviderFields.description = description;
    if (servicesOffered) serviceProviderFields.servicesOffered = servicesOffered;
    if (contactNumber) serviceProviderFields.contactNumber = contactNumber;
    if (address) serviceProviderFields.address = address;
    if (isVerified !== undefined) serviceProviderFields.isVerified = isVerified;

    try {
        let serviceProvider = await ServiceProvider.findOne({ user: req.user.id });

        if (!serviceProvider) return res.status(404).json({ msg: 'Service Provider not found' });

        serviceProvider = await ServiceProvider.findOneAndUpdate(
            { user: req.user.id },
            { $set: serviceProviderFields },
            { new: true }
        );

        res.json(serviceProvider);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Service Provider Profile
exports.deleteServiceProviderProfile = async (req, res) => {
    try {
        await ServiceProvider.findOneAndRemove({ user: req.user.id });
        res.json({ msg: 'Service Provider removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};