const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
app.use(express.json());

require('dotenv').config();
const port = 3001;
const secret = '10';

const auth = ( req, res, next ) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) res.status(501).send('auth header missing!');
    const token = authHeader.split(' ')[0];
    const user = jwt.verify(authHeader, '10');
    console.log(user);
    next();
}

app.post('/user/login', (req, res) => {
    console.log(req.body);
    const user = req.body;
    const token = jwt.sign(user, secret, {expiresIn: '10m'});
    console.log('token sent.');
    return res.send(token);
});

app.get('/user/login', auth, (req, res) => {
    console.log('you have been authenticated.');
});
app.listen(port, () => {
    console.log(`Service User: Listening on port ${port}`);
});