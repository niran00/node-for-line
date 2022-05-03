const express = require("express");
const multer = require("multer");
const app = express();
let checkAuth = require("../middleware/check-auth.js");
const bookRoute = express.Router();
let Book = require("../model/book.js");

const MINE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MINE_TYPE[file.mimetype];
    let error = new Error("Invalid mine type");
    if (isValid) {
      null;
    }
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MINE_TYPE[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// Add Book
bookRoute
  .route("/add-book")
  .post(
    checkAuth,
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
      const imgurl = req.secure + "://" + req.get("host");
      const bookdata = new Book({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        creator: req.userData.userId,
        imagePath: imgurl + "/images/" + req.file.filename,
      });
      Book.create(bookdata, (error, data) => {
        if (error) {
          return next(error);
        } else {
          console.log(req.userData);
          res.json(data);
        }
      });
    }
  );

// Get all Book
bookRoute.route("/").get(checkAuth, (req, res) => {
  Book.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get Book
bookRoute.route("/read-book/:id").get((req, res) => {
  Book.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update Book
bookRoute.route("/update-book/:id").put(checkAuth, (req, res, next) => {
  Book.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    {
      $set: req.body,
    },
    (error, data) => {
      if (data.modifiedCount > 0) {
        res.status(200).json({ message: "updated successfully" });
        console.log("Book updated successfully!");
      } else {
        res.status(401).json({ message: "Not Authorized" });
        console.log("User Not Authorized");
      }
    }
  );
});

// Delete Book
bookRoute.route("/delete-book/:id").delete(checkAuth, (req, res, next) => {
  Book.findOneAndRemove(
    { _id: req.params.id, creator: req.userData.userId },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data,
        });
      }
    }
  );
});

module.exports = bookRoute;
