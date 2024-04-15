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

const updateListing = async (req,res,next) => {
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
        res.status(200).json({
            success: true,
            listing: updatedListing
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500,"Internal Server Error"));
    }
}

const getListing = async (req, res,next) => {
    try {
        const id = req.params.id;
        const listings = await Listing.find({_id : id});
        if(listings.length === 0){
            return next(errorHandler(404,"Listing not found"));
        }
        return res.status(200).json({
            success: true,
            count: listings.length,
            listings
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500,"Internal Server Error"));
    }
}

const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
    
        let offer = req.query.offer;
    
        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] };
        }
    
        let furnished = req.query.furnished;
    
        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [false, true] };
        }
    
        let parking = req.query.parking;
    
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] };
        }
    
        let type = req.query.type;
    
        if (type === undefined || type === "all") {
            type = { $in: ["sale", "rent"] };
        }
    
        const searchTerm = req.query.searchTerm || "";
    
        const sort = req.query.sort || "createdAt";
    
        const order = req.query.order || "desc";
    
        const listings = await Listing.find({name : { $regex: searchTerm, $options: "i" },furnished,parking,offer,type}).sort({ [sort]: order }).limit(limit).skip(startIndex);
        return res.status(200).json(listings);
        } catch (error) {
        next(error);
        }
};

module.exports = {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings
}