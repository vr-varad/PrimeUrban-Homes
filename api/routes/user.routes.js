const express = require('express')

const router = express.Router()

const User = require('../models/user.model')
const userController = require('../controller/user.controller')

router.get('/',userController.test)

module.exports = router     