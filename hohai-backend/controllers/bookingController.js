const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Create a new booking
exports.createBooking = async (req, res) => {
    const { serviceId, bookingDate } = req.body;

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        // Check if the requested bookingDate is available for the service
        // This is a simplified check. A more robust system would manage time slots.
        if (!service.availableDates.includes(new Date(bookingDate).toISOString())) {
            // Convert both dates to ISO strings for accurate comparison
            const isDateAvailable = service.availableDates.some(date => new Date(date).toISOString() === new Date(bookingDate).toISOString());
            if (!isDateAvailable) {
                return res.status(400).json({ msg: 'Service not available on this date' });
            }
        }

        const newBooking = new Booking({
            customer: req.user.id, // Assuming customer ID is available from authentication middleware
            service: serviceId,
            serviceProvider: service.serviceProvider,
            bookingDate
        });

        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all bookings for a user (customer or service provider)
exports.getBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.userType === 'customer') {
            bookings = await Booking.find({ customer: req.user.id })
                .populate('service', ['name', 'description', 'price'])
                .populate('serviceProvider', ['companyName']);
        } else if (req.user.userType === 'serviceProvider') {
            bookings = await Booking.find({ serviceProvider: req.user.id })
                .populate('service', ['name', 'description', 'price'])
                .populate('customer', ['email']);
        } else {
            return res.status(403).json({ msg: 'User type not authorized to view bookings' });
        }

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update booking status (e.g., confirmed, cancelled) - typically by service provider
exports.updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Ensure only the service provider associated with the booking can update its status
        if (booking.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};