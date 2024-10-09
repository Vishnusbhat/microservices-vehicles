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
        console.log('MongoDB connected successfully.');
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
        required: false
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

const auth = ( req, res, next ) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) res.status(501).send('auth header missing!');
    const token = authHeader.split(' ')[0];
    const user = jwt.verify(authHeader, '10');
    console.log(user);
    next();
}


app.post('/user/signup', async (req, res) => {
    console.log(req.body);
    try {
        const { name, email, password, phone } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            console.log('User already exists: ' + user);
            return res.status(401).json('User found! Proceed to login.');
        }

        const newUser = new User({ name, email, password, phone });
        await newUser.save();
        console.log('New user created.');

        const token = jwt.sign({ name, email }, secret, { expiresIn: '30m' });
        console.log('Token created at the server.');
        return res.json({ token });

    } catch (error) {
        console.log('Failed to send the token to the client: ' + error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/user/login', auth, (req, res) => {
    console.log('you have been authenticated.');
    res.json('authenticated.');
});
app.listen(port, () => {
    console.log(`Service User: Listening on port ${port}`);
});