const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');

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

const signin = async (req,res,next) => {
    let {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return next(errorHandler(401, 'User not found!'));
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return next(errorHandler(401, 'Invalid password!'));
        }
        const token = jwt.sign({userId: user._id}, process.env.jwtSecret, {expiresIn: '2h'});

        const {password: pass, ...userWithoutPassword} = user._doc;


        res.cookie('accessToken',token,{httpOnly : true}).status(200).json({
            message: "User successfully logged in!",
            userWithoutPassword
        })
    } catch (error) {
        next(errorHandler(500,error.message))
    }

}

const google = async(req,res,next) => {
    try {
        const {displayName, email, photoURL} = req.body;
        const user = await  User.findOne({email});
        if(user){
            const token = jwt.sign({userId: user._id}, process.env.jwtSecret, {expiresIn: '2h'});
            const {password, ...userWithoutPassword} = user._doc;
            return res.cookie('accessToken',token,{httpOnly : true}).status(200).json({
                message: "User successfully logged in!",
                userWithoutPassword
            })
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10)
            const newUser = await new User({
                username: displayName.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 1000),
                email,
                password: hashedPassword,
                profilePicture : photoURL
            });
            await newUser.save();
            const token = jwt.sign({userId: newUser._id}, process.env.jwtSecret, {expiresIn: '2h'});
            const {password, ...userWithoutPassword} = newUser._doc;
            return res.cookie('accessToken',token,{httpOnly : true}).status(200).json({
                message: "User successfully logged in!",
                userWithoutPassword
            })
        }
    } catch (error) {
        next(errorHandler(500,error.message))
    }
}


const signout = (req,res, next) => {
    try {
        res.clearCookie('accessToken').status(200).json({
            message: 'User successfully logged out!'
        })
    } catch (error) {
        next(errorHandler(500,error.message))
    }


}

module.exports = {
    signup,
    signin,
    google,
    signout
};