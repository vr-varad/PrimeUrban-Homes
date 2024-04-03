const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const errorHandler = require('../utils/error');

const signup = async (req, res, next) => {
    try {
        let {username,email, password} = req.body;
        password = await bcrypt.hash(password, 10);
        const newUser = await new User({
            username,
            email,
            password
        });
        await newUser.save();
        return res.status(201).json({
            message: 'User created successfully!',
            user: newUser
        });
    } catch (error) {
        next(errorHandler(500, error.message))
    }
};

module.exports = {
    signup
};