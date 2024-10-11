const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());
// app.use(bodyParser);
const Vehicle = require('./vehicleSchema');

const secret = process.env.SECRET_TOKEN_KEY;
const uri = 'mongodb+srv://user:user@cluster0.k4iy6.mongodb.net/Vehicles?retryWrites=true&w=majority&appName=Cluster0';
const port = process.env.PORT;


{
const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Vehicle Service: MongoDB connected successfully.');
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

app.post('/vehicle/add', auth, async ( req, res ) => {
    const userID = req.user._id;
    const token = req.headers['authorization'];
    try {
        const newVehicle = new Vehicle({
            ...req.body,
            owner: userID
        });
        const addedVehicle = await newVehicle.save();
        const addVehicleToOwner = await axios.post(`http://localhost:3001/user/vehicle/${addedVehicle._id}`, {}, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return res.status(201).json("New vehicle added.");
    }catch (error){
        console.log('Error adding new vehicle: ' + error.message);
    }

});//to add new vehicle. Will automatically addToSet in the user collection of the Owner.

app.delete('/vehicle/delete/:vehicle', auth, async ( req, res ) => {
    console.log('running delete.');
    const token = req.headers['authorization'];
    const vehicleID = req.params.vehicle; 
    const vehicle = await Vehicle.findOne({_id : vehicleID});
    const ownerID = vehicle.owner;
    //call user service to delete the vehicle in the owner's document
    try {
        const deleteVehicleFromOwner = await axios.delete(`http://localhost:3001/user/vehicle/delete/${vehicleID}`, {
            headers: {
                'authorization' : `${token}`
            }
        });
        console.log ('Vehicle deleted from the collection.');
        try{
            await vehicle.deleteOne();
            console.log('Vehicle deleted successfully.');
        }catch(error){
            console.log('Error deleting vehicle: ' + error.message);
        }
        return res.status(200).json("Vehicle deleted successfully.");
    } catch (error) {
        console.log ('Error deleting vehicle from Vehicle Collection: ' + error.message);
    }
    //delete the vehicle

});//to delete a vehicle. also delete it in the user db.

app.get('/vehicle', async ( req, res ) => {
    try {
        const vehicles = await Vehicle.find({}, {_id: 1, name: 1, model: 1, brand: 1, year: 1, color: 1, milage: 1});
        console.log("Vehicle list retrieved.");
        console.log(vehicles);
        return res.status(200).json(vehicles);
    } catch ( error ){
        console.log("Error in getting the vehicle list: " + error.message);
    }
    
});

app.put(`/vehicle/:vehicleID`, auth, async ( req, res ) => {
    const user = req.user;
    const vehicleID = req.params.vehicleID;
    const vehicle = await Vehicle.findOne({_id: vehicleID});
    if (vehicle.owner.toString() !== user._id.toString()) return res.status(500).json("Not authorised to update the vehicle.");
   try {
        await Vehicle.updateOne(
        {_id: vehicleID},
        {$set: req.body}
        );
        console.log('Vehicle updated.');
        return res.status(200).json("Vehicle updated.");
    } catch (error){
        console.log("Error updating vehicle: " + error.message);
    }

});//to update the details of the existing vehicles by their owners.







app.listen(port, () => {
    console.log(`Vehicle Service: Listening on port ${port}`);
})