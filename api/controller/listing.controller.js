const Listing = require('../models/listing.model.js');
const errorHandler = require('../utils/error');

const createListing = async (req, res,next) => {
    try {
        // console.log(req.body)
        const listing = await Listing.create(req.body);
        return res.status(201).json({ listing });
    } catch (error) {
        console.log(error);
        next(errorHandler(500,"Internal Server Error"));
    }
}

const deleteListing = async (req, res,next) => {
    try {
        console.log(req.user)
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if(!listing){
            return next(errorHandler(404,"Listing not found"));
        }
        if(req.user.userId !== listing.userRefernce){
            return next(errorHandler(401,'Unauthorized'));
        }
        return res.status(200).json({
            success: true,
            message: 'Listing has been deleted'
        })
        
    } catch (error) {
        console.log(error)
        next(errorHandler(500,"Internal Server Error"));
    }
}

const updateListing = async (req, res,next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,"Listing not found"));
    }
    if(req.user.userId !== listing.userRefernce){
        return next(errorHandler(401,'Unauthorized'));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        req.status(200).json({
            success: true,
            listing: updatedListing
        })
    } catch (error) {
        next(errorHandler(500,"Internal Server Error"));
    }
}

module.exports = {
    createListing,
    deleteListing,
    updateListing
}