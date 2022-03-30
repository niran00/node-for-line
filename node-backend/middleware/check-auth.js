const jwt = require('jsonwebtoken');

 const checkUserAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'this_is_the_secret');
        next();
    } catch(error){
        res.status(401).json({message: "login failed"})
    }
  
};

module.exports = checkUserAuth;