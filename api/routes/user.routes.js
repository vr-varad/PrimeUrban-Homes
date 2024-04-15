const express = require('express')

const verifyToken = require('../utils/verifyUser')

const router = express.Router()

const User = require('../models/user.model')
const userController = require('../controller/user.controller')

router.get('/:id',userController.getUser)
router.post('/update/:id',verifyToken,userController.updateUser)
router.delete('/delete/:id',verifyToken,userController.deleteUser)
router.get('/listing/:id',verifyToken,userController.getUserListing)


module.exports = router     