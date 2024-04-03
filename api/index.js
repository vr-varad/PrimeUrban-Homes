const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const app = express()

mongoose.connect(process.env.mongo_url).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err)
});


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});