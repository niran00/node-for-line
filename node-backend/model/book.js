const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Book = new Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
    },
    details1: {
      type: String,
    },
    details2: {
      type: String,
    },
    details3: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
  },
  {
    collection: "books",
  }
);

module.exports = mongoose.model("Book", Book);
