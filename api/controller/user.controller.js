const errorHandler = require('../utils/error')
const bcrypt = require('bcrypt')
const User = require('../models/user.model.js')    
const Listing = require('../models/listing.model.js')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

const getUser = async(req, res,next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const {password,...userWithoutPassword} = user._doc;
        res.status(200).json({
            success: true,
            userWithoutPassword
        })
    } catch (error) {
        next(errorHandler(500,'Internal Server Error'))
    }
}

const updateUser = async (req,res,next)=>{
    if(req.params.id !== req.user.userId){
        return next(errorHandler(401,'Unauthorized'));
    }
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set : {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture
        }},{new:true});
        const {password,...userWithoutPassword} = updatedUser._doc;
        res.status(200).json({
            success: true,
            userWithoutPassword
        })
    } catch (error) {
        next(errorHandler(500,'Internal Server Error'))
    }
}

const deleteUser = async (req,res,next)=>{
    if(req.user.userId !== req.params.id){
        return next(errorHandler(401,'Unauthorized'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('accessToken');
        res.status(200).json({
            success: true,
            message: 'User has been deleted'
        })
        
    } catch (error) {
        return next(errorHandler(500,'Internal Server Error'));   
    }
}

const getUserListing = async (req,res,next)=>{
    if(req.user.userId !== req.params.id){
        return next(errorHandler(401,'Unauthorized'));
    }
    try {
        const listings = await Listing.find({userRefernce: req.params.id});
        res.status(200).json({
            success: true,
            listings
        })
        
    } catch (error) {
        next(errorHandler(500,'Internal Server Error'))
        
    }
}

const forgotPassword = async(req, res, next) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({email: email});
        const token = jwt.sign({id: user._id},process.env.jwtSecret,{expiresIn: '1d'});
        if(!user){
            return next(errorHandler(404,'User not found'));
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "varadgupta21@gmail.com",
                pass: process.env.nodemailer_passkey,
            },
        });
        
        async function main() {
            const info = await transporter.sendMail({
                from: 'varadgupta21@gmail.com', 
                to: email,
                subject: "PrimeUrban Homes Reset Password",
                text: `Reset Password Link : https://primeurban-homes.onrender.com/reset-password/${user._id}/${token}`,
            });
        }  
        main().catch(console.error);
        res.status(200).json({
            success: true,
            message: 'Reset link sent to your email'
        })
    }catch(error){
        next(errorHandler(500,'Internal Server Error'))
    }   
}

const resetPassword = async(req,res, next)=>{
    try {
        const userId = req.params.userId;
        const token = req.params.token;
        const {password} = req.body;
        const verifiedToken = jwt.verify(token,process.env.jwtSecret);
        if(verifiedToken.id !== userId){
            return next(errorHandler(401,'Unauthorized'));
        }
        const hashedPassword = bcrypt.hashSync(password,10);
        await User.findByIdAndUpdate(userId,{$set: {password: hashedPassword}});
        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        })
    } catch (error) {
        next(errorHandler(500,'Internal Server Error'))
    }
}



module.exports = {
    getUser,
    updateUser,
    deleteUser,
    getUserListing,
    forgotPassword,
    resetPassword
}
