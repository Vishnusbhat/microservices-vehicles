const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    vehicleID: {    
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'vehicles'
    },
    price: {    
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    maxSpeed: {
        type: Number,
        default: 100
    }
});

const List = mongoose.model('listing', listSchema);

module.exports = List;