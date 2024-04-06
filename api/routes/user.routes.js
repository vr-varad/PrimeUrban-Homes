const express = require('express')

const verifyToken = require('../utils/verifyUser')

const router = express.Router()

const User = require('../models/user.model')
const userController = require('../controller/user.controller')

router.get('/',userController.test)
router.post('/update/:id',verifyToken,userController.updateUser)

module.exports = router     