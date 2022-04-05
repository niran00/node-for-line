const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken  = jwt.verify(token, 'this_is_the_secret');
        req.userData = {userId: decodedToken.userId, unqUserId: decodedToken.unqUserId }
        next();
    } catch(error){
        res.status(401).json({message: "login failed"})
    }
  
};