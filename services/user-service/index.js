const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
app.use(express.json());

const port = 3001;

app.listen(port, () => {
    console.log(`Service User: Listening on port ${port}`);
});