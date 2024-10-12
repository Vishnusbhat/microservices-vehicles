const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    ReviewID: {    
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'vehicles'
    },
    userID: {    
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Comment = mongoose.model('comment', commentchema);

module.exports = Comment;