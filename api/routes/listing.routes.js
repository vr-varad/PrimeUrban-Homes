const express = require('express');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();
const { createListing,deleteListing,updateListing } = require('../controller/listing.controller');

router.post('/create',verifyToken, createListing)
router.delete('/delete/:id',verifyToken, deleteListing)
router.post('/update/:id',verifyToken, updateListing)   


module.exports = router;