const errorHandler = require('../utils/error')
const bcrypt = require('bcrypt')
const User = require('../models/user.model.js')    
const Listing = require('../models/listing.model.js')

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



module.exports = {
    getUser,
    updateUser,
    deleteUser,
    getUserListing
}
