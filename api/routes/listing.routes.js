const express = require('express');

const router = express.Router();
const { createListing } = require('../controller/listing.controller');

router.post('/create', createListing)


module.exports = router;