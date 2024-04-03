const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(express.json())

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})


const start = async () => {
    try {
        await mongoose.connect(process.env.mongo_url).then(() => {
            console.log('Connected to MongoDB')
        }).catch((err) => {
            console.log('Failed to connect to MongoDB', err)
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log('Failed to start server', error)
    }
}

start()