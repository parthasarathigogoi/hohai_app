const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    servicesOffered: [
        {
            type: String
        }
    ],
    contactNumber: {
        type: String
    },
    address: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);