const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },
        description : {
            type: String,
            required: true,
            trim: true,
            minlength: 10
        },
        price : {
            type: Number,
            required: true
        },
        regularPrice : {
            type: Number,
            required: true
        },
        discountedPrice : {
            type: Number,
            required: true
        },
        bedrooms : {
            type: Number,
            required: true
        },
        furnished : {
            type: Boolean,
            required: true
        },
        type : {
            type: String,
            required: true
        },
        offer : {
            type: Boolean,
            required: true
        },
        images : {
            type: Array,
            required: true
        },
        userRefernce : {
            type : String,
            required: true
        },
        
    },
    { timestamps: true }
    );

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;