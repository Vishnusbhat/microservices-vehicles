const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const mongoose = require('mongoose');

const uri =  'mongodb+srv://user:user@cluster0.k4iy6.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0';
{
// mongodb+srv://vishnu:kirito@asuna@cluster0.k4iy6.mongodb.net/

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('User Service: MongoDB connected successfully.');
    } catch (err)   {
        console.log('Error connecting to DB: ' + err.message);
        process.exit(1);
    }
}
connectDB();

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB.');
});

mongoose.connection.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to application termination.');
    process.exit(0);
});
}

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\+?[0-9]{10,15}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        required: true
    },
    vehicles: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'vehicles'
    }
});

const User = mongoose.model('User', userSchema);

require('dotenv').config();
const port = 3001;
const secret = process.env.SECRET_TOKEN_KEY;

app.use((err, req, res, next) => {
    if (err instanceof Error) console.log('Server Error: ' + err.message);
    next();
});

const auth = async ( req, res, next ) => {
    console.log('Auth function running.');
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) res.status(501).send('auth header missing!');
    const user = jwt.verify(token, secret);
    const fullUserDetails = await User.findOne({email: user.email});
    console.log(fullUserDetails);
    req.user = fullUserDetails;
    console.log(user);
    console.log('Auth function terminated.');
    next();
}//fuction that authenticates each API calls

app.post('/user/signup', async (req, res) => {
    console.log(req.body);
    try {
        const { name, email, password, phone, address } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            console.log('User already exists: ' + user);
            return res.status(401).json('User found! Proceed to login.');
        }
        const newUser = new User({ name, email, password, phone, address });
        await newUser.save();//new user is added to the collection.
        console.log('New user created.');
        const token = jwt.sign({ name, email }, secret, { expiresIn: '30m' });
        console.log('Token created at the server.');
        return res.json({ token, "message": "Signup successful." });
    } catch (error) {
        console.log('Failed to send the token to the client: ' + error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});//a new user is created if not previously existing in the collection. A new token is issued after creation of the user.

app.post('/user/login', async (req, res) => {
    console.log('Trying to login.');
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log('User does not exist. Please Signup.');
        return res.status(404).json('User not found!');
    }
    const token = jwt.sign({
        'name': user.name,
        'email': user.email
    }, secret, {expiresIn: '30m'});
    console.log('Login successful.');
    return res.json({token, 'message': 'login successful.'});
});//used to login to an existing user. A new token will be returned.

app.post('/user/vehicle/:vehicle', auth, async (req, res) => {
    const vehicleID = req.params.vehicle;
    const user = req.user;
    await User.updateOne(
        { _id: user._id },
        { $addToSet: {vehicles: vehicleID}}, {new: true}
    )
    return res.status(200).json({'userID' : user._id});
});//when a new vehicle is added by a user, the vehicle service will talk to user service to get the user ID and also provide the vehicle ID to be added into the 'Vehicles' array in the user schema.

app.delete('/user/vehicle/delete/:vid', auth, async ( req, res ) => {
    console.log("running function to delete entry from the array.");
    const vID = req.params.vid;
    console.log(vID);
    const userID = req.user._id;
    try {
        const deleteVehicle = await User.updateOne(
            {_id: userID},
            {$pull: { vehicles: vID}}
        );
        console.log('Vehicle deleted from the user list.');
        return res.status(200).json("Vehicle deleted from the user list.");
    } catch (error){
        console.log ('Error deleting vehicle from the user collection: ' + error.message);
        return res.status(500).json("Error deleting the vehicle from the user list.");
    }
}); 

app.get('/user/details', auth, (async ( req, res ) => {
    console.log('Sending user details...');
    const user = req.user;
    console.log(user);
    return res.status(201).json({ user });
}));//to return the full structure of the user object when the user requests for it. Cannot be accessed by other users.

app.get('/user/list', async ( req, res ) => {
    const user = await User.find({}, {name: 1, email: 1});
    return res.json({ user });
});//to return the list of all the users 'Name', 'Email' and ObjID. No autherisation is needed.

app.delete('/user/delete', auth, async ( req, res ) => {
    const user = req.user;
    await User.deleteOne({ _id: user._id });
    return res.json("Deleted User: " + user.name);
});//to delete the user that is making the request. The id will be collected through the header in the auth function.

app.put('/user/update', auth, async ( req, res ) => {
    const user = req.user;
    const updateData = req.body;
    await User.updateOne({_id: user._id }, { $set: updateData });
    return res.status(201).json({"message": "Updated the data:", "Updated data" : updateData});
});//to update any section of the user document. It can update only one section of the document while all the other parts are left untouched.


app.listen(port, () => {
    console.log(`Service User: Listening on port ${port}`);
});