const express = require('express');
const app = express();
let checkAuth = require('../middleware/check-auth.js');
const bookRoute = express.Router();
let Book = require('../model/book.js');

// Add Book
bookRoute.route('/add-book').post( checkAuth, (req, res, next) => {
  Book.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all Book
bookRoute.route('/').get( checkAuth, (req, res) => {
  Book.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get Book
bookRoute.route('/read-book/:id').get((req, res) => {
  Book.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update Book
bookRoute.route('/update-book/:id').put((req, res, next) => {
  Book.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Book updated successfully!')
    }
  })
})

// Delete Book
bookRoute.route('/delete-book/:id').delete((req, res, next) => {
  Book.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = bookRoute;