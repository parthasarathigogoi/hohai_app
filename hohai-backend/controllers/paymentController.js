const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Process a payment
exports.processPayment = async (req, res) => {
    const { bookingId, amount, currency, paymentMethodId } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Create a Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            description: `Payment for booking ${bookingId}`,
            metadata: { bookingId: bookingId, customerId: req.user.id, serviceProviderId: booking.serviceProvider.toString() }
        });

        const newPayment = new Payment({
            booking: bookingId,
            customer: req.user.id,
            serviceProvider: booking.serviceProvider,
            amount,
            currency,
            transactionId: paymentIntent.id,
            status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed'
        });

        const payment = await newPayment.save();

        // Update booking status to confirmed if payment is successful
        if (payment.status === 'completed') {
            booking.status = 'confirmed';
            await booking.save();
        }

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get payment details by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('booking', ['bookingDate', 'status'])
            .populate('customer', ['email'])
            .populate('serviceProvider', ['companyName']);

        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        // Ensure only customer or service provider involved in the payment can view it
        if (payment.customer.toString() !== req.user.id && payment.serviceProvider.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};