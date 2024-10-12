const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true
    },
    vehicleID: {    
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'vehicles'
    },
    userID: {    
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    stars: {    
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: [mongoose.Types.ObjectId],
        ref: 'comments'
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;