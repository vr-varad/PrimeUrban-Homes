const express = require('express')

const router = express.Router();

const authController = require('../controller/auth.controller')

router.post('/signup', authController.signup)

module.exports = router