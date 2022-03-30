const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const userRoute = express.Router();
let User = require('../model/user.js');
let checkAuth = require('../middleware/check-auth.js');

// Add User
userRoute.route('/add-user', checkAuth).post((req, res, next) => {
  User.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all User
userRoute.route('/user').get((req, res) => {
  User.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get User
userRoute.route('/read-user/:id').get((req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update User
userRoute.route('/update-user/:id').put((req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('User updated successfully!')
    }
  })
})

// Delete User
userRoute.route('/delete-user/:id').delete((req, res, next) => {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

//Login
userRoute.route('/login').post((req, res, next) => {
  let fetchedUser;
  User.findOne({ userId: req.body.userId })
  .then(user => {
    if(!user){
      return res.status(404).json({
        message: 'auth failed'
      });
    }  
    fetchedUser = user;
    const token = jwt.sign(
      { userId: fetchedUser.userId, unqUserId: fetchedUser._id },
      'this_is_the_secret',
      {expiresIn: '1h' }
    );
    res.status(200).json({
      token: token
    })
  })
  .catch(err =>{
    return res.status(404).json({
      message: 'auth failed, not successful'
    });
  });

});

module.exports = userRoute;