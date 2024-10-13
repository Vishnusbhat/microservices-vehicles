const express = require('express');
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const secret = process.env.SECRET_TOKEN_KEY;
const port = process.env.PORT;
const uri = 'mongodb+srv://user:user@cluster0.k4iy6.mongodb.net/Reviews?retryWrites=true&w=majority&appName=Cluster0';
const Review = require('./reviewSchema');
const Comment = require('./commentSchema');
{
    const connect = async () => {
        try {
            await mongoose.connect(uri);
            console.log('Review Service: MongoDB connected successfully.');
        }catch (error){
            console.log('Error connecting to DB: ' + error.message);
            process.exit(1);
        }
    }
    connect();
    
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected from MongoDB.');
    });
    
    mongoose.connection.on('SIGINT', async () => {
        await  mongoose.connection.close();
        console.log('MongoDB connection closed due to application termination.');
        process.exit(0);
    });
}//to connect to MongoDB

const auth = async ( req, res, next ) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(500).json("auth header missing!");
    const user = jwt.verify(token, secret);
    if (!user) return res.status(500).json("No user is attached to the request!");
    
    //add a call to get user object from email.
    const fullUserDetails = await axios.get('http://localhost:3001/user/details', 
        {
                headers: {
                'authorization': `${token}`
            }
        }
    );
    req.user = fullUserDetails.data.user;
    console.log('Authentication completed.');
    next();
}//to authorize the user and authenticate. Also assigns the req.user property.

//add a review
app.post('/review/:vehicleID', auth, async ( req, res ) => {
    const vehicleID = req.params.vehicleID;
    const token = req.headers['authorization'];
    const user = req.user;
    const { review, stars } = req.body;
    const newReview = Review({
        review: review,
        vehicleID: vehicleID,
        userID: user._id,
        stars: stars
    });
    // console.log(newReview);
    try {
        const newReviewSaved = await newReview.save();
        const objForVehicle = {
            _id: newReviewSaved._id,
            vehicleID: vehicleID,
            stars: stars
        }
        const send = await axios.post('http://localhost:3002/vehicle/review', objForVehicle, {
            headers: {
                'authorization' : `${token}`
            }
        });
        return res.status(200).json("Review saved successfully.");
    } catch ( error ){
        console.log("Error in saving the review:" + error.message);
        return res.status(500).json("Error in saving the review.");
    }
});

//delete a review
app.delete('/review/:reviewID', auth, async ( req, res ) => {
    const reviewID = req.params.reviewID;
    const token = req.headers['authorization'];
    const user = req.user;
    try {   
        const review = await Review.findById(reviewID);
        if (user._id.toString() !== review.userID.toString()) return res.status(501).json("Not authorized!");
        const vehicleID = review.vehicleID;
        const removeReview = await axios.put(`http://localhost:3002/vehicle/review/${vehicleID}`, {
            reviewID: reviewID,
            stars: review.stars
        }, {
            headers: {
                'authorization' : `${token}`
            }
        });
        if (review.comments.length === 0) await review.deleteOne();
        else {
            await review.updateOne({$set: {review: "This review has been deleted by the user.", deleted: true, stars: 0}});
            console.log('Content of the review has been updated as this review has comments.');
        }
        return res.status(200).json("Review deleted.");    
    } catch ( error ){
        console.log("Error deleting the review: " + error.message);
        return res.status(500).json("Server error while deleting the review.");
    }

});

//add a comment
app.post('/review/comment/:reviewID', auth, async ( req, res ) => {
    const userID = req.user._id;
    const reviewID = req.params.reviewID;
    const { comment } = req.body;
    if (!comment) return res.json(502).json("Add content to comment!");
    const newComment = new Comment ({
        comment: comment,
        ReviewID: reviewID,
        userID: userID
    });
    try {
        const comment = await newComment.save();
        const review = await Review.findById(reviewID);
        await review.updateOne({$push: { comments: comment._id }});
        console.log("Comment added to the review.");
        return res.status(200).json("Comment added to the review.");
    } catch ( error ) {
        console.log("Error adding the comment to the review: " + error.message);
        return res.status(500).json("Error adding the comment to the review.");
    }
});

//delete a comment
app.delete('/review/comment/:commentID', auth, async ( req, res ) => {
    const commentID = req.params.commentID;
    const user = req.user;
    try {
        const comment = await Comment.findById(commentID);
        if (user._id.toString() !== comment.userID.toString())
            return res.status(500).json("Not Authorised.");
        const review = await Review.findById(comment.ReviewID);
        if (review.comments.length == 1 && review.deleted){
            await review.deleteOne();
        }else{
            await comment.deleteOne();
            await review.updateOne({$pull: {comments: commentID}});
        }
        console.log("Comment deleted.");
        return res.status(200).json("Comment deleted.");
    }catch (error){
        console.log("Error deleting the comment: " + error.message);
        return res.status(500).json("Error deleting the comment.");
    }
});

//get all reviews for a vehicle
app.get('/review/:vehicleID', async ( req, res ) => {
    const vehicleID = req.params.vehicleID;
    try {
        const reviews = await Review.find({vehicleID: vehicleID}, {comments: 0});
        console.log('GOT all the reviews of the vehicle.');
        return res.status(200).json(reviews);
    } catch ( error ){
        console.log("Error GET the reviews of the vehicle.");
        return res.status(500).json("Error GET the reviews of the vehicle.");
    }
});

//get all comments for a review
app.get('/review/comment/:reviewID', auth, async ( req, res ) => {
    const reviewID = req.params.reviewID;
    try{
        const comments = await Comment.find({ReviewID: reviewID});
        console.log("Comments found for the review.");
        return res.status(200).json(comments);
    }catch (error){
        console.log("Error getting the comments: " + error.message);
        return res.status(500).json("Error getting the comments.");
    }
});


app.listen(port, () => {
    console.log(`Review Service: Listening on port ${port}`);
});