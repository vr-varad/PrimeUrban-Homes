const Listing = require('../models/listing.model.js');
const errorHandler = require('../utils/error');

const createListing = async (req, res,next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({ listing });
    } catch (error) {
        next(errorHandler(500,"Internal Server Error"));
    }
}

module.exports = {
    createListing
}