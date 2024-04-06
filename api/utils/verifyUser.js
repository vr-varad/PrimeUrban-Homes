const errorHandler = require('./error')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = async(req,res,next) =>{
    const token = req.cookies.accessToken;
    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
        jwt.verify(token,process.env.jwtSecret, (err,user) => {
            if(err){
                return next(errorHandler(401,'Unauthorized'));
            }
            req.user = user;
            next();
        })
}

module.exports = verifyToken