const Service = require('../models/Service');

// Create Service
exports.createService = async (req, res) => {
    const { name, description, price, category, availableDates } = req.body;

    try {
        const newService = new Service({
            serviceProvider: req.user.id, // Assuming service provider ID is available from authentication middleware
            name,
            description,
            price,
            category,
            availableDates
        });

        const service = await newService.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate('serviceProvider', ['companyName', 'description']);
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('serviceProvider', ['companyName', 'description']);

        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Service
exports.updateService = async (req, res) => {
    const { name, description, price, category, availableDates } = req.body;

    // Build service object
    const serviceFields = {};
    if (name) serviceFields.name = name;
    if (description) serviceFields.description = description;
    if (price) serviceFields.price = price;
    if (category) serviceFields.category = category;
    if (availableDates) serviceFields.availableDates = availableDates;

    try {
        let service = await Service.findById(req.params.id);

        if (!service) return res.status(404).json({ msg: 'Service not found' });

        // Make sure user owns service
        if (service.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        service = await Service.findByIdAndUpdate(
            req.params.id,
            { $set: serviceFields },
            { new: true }
        );

        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) return res.status(404).json({ msg: 'Service not found' });

        // Make sure user owns service
        if (service.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await service.remove();

        res.json({ msg: 'Service removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};