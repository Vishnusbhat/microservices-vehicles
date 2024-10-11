const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    vehicleID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Vehicle'
    },
    price: {
        type: Number,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    ownerID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    completed: {
        type: Boolean,
        required: true,
        defauld: false
    },
    canceled: {
        type: Boolean,
        required: true,
        defauld: false
    }
});

const Booking = mongoose.model('booking', bookingSchema);
module.exports = Booking;