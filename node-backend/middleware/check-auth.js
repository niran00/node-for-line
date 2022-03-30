const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'this_is_the_secret');
        console.log("all good");
        next();
    } catch(error){
        res.status(401).json({message: "login failed"})
    }
  
};