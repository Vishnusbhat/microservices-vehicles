const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    numberPlate: {
        type: String,
        unique: true,
        required: true
    },
    color: {
        type: String
    },
    mileage: {
        type: Number
    },
    listed: {
        type: Boolean,
        required: true,
        default: false
    },
    rented: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'reviews'
    },
    reviewCount: {
        type: Number,
        required: true,
        default: 0
    },
    totalStars: {
        type: Number,
        required: true,
        default: 0
    }
});

const Vehicle = mongoose.model('vehicle', vehicleSchema);

module.exports = Vehicle;
// export default Vehicle;