// const axios  = require('axios');

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
let checkAuth = require("../middleware/check-auth.js");
const userRoute = express.Router();
let User = require("../model/user.js");
let ServiceClass = require("./service");
const service = new ServiceClass();

// OTP
userRoute.route("/verify").post(async (req, res, next) => {
  // const sdk = require("api")("@thaibulksms/v1.0#3s3hunt2tktwn9w2l");

  // await sdk
  //   .post(
  //     "/v2/otp/request",
  //     {
  //       key: "1724714224731529",
  //       secret: "3ae964a18447ad4545b15e3648abb059",
  //       msisdn: req.body.userPhoneNumber,
  //     },
  //     { Accept: "application/json" }
  //   )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.error(err));

  let test = await service.requestOtp(req.body.userPhoneNumber);
  // let res = {
  //   token: "test123",
  //   refno: "654321",
  // };
  return res.status(200).json({
    aMessage: "what we need",
    otpTok: test.token,
    otpPin: test.refno,
  });
  //   {
  //     "status": "success",
  //     "token": "kRpKN6vjmAr7Y6AF7I63BbEwMVq845nx",
  //     "refno": "3L31J"
  // }
});

// Add User
userRoute.route("/add-user").post(async (req, res, next) => {
  let data = req.body;
  // let test = await service.requestOtp(req.body.userPhoneNumber);
  let userDr = data[0];
  let pin = data[1];
  let token = data[2];
  // let verify = await service.verifyOTP(token, pin);
  let verify = {
    status: "success",
    token: "test123",
    refno: "654321",
  };
  if (verify.status == "success") {
    User.create(userDr, (error, data) => {
      if (error) {
        console.log("no");
        console.log(userDr);
        return next(error);
      } else {
        // await axios()
        res.json(userDr);
        console.log("pass");
      }
    });
  } else {
    console.log(pin);
    console.log(verify);
  }

  // res.json(test);
});

// Get all User
userRoute.route("/user").get(checkAuth, (req, res) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get User
userRoute.route("/read-user/:id").get((req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update User
userRoute.route("/update-user/:id").put((req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
        console.log("User updated successfully!");
      }
    }
  );
});

// Delete User
userRoute.route("/delete-user/:id").delete((req, res, next) => {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

//Login
userRoute.route("/login").post((req, res, next) => {
  let fetchedUser;
  User.findOne({ userId: req.body.userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "auth failed",
        });
      }
      fetchedUser = user;
      const token = jwt.sign(
        { userId: fetchedUser.userId, unqUserId: fetchedUser._id },
        "this_is_the_secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        tokenUserId: fetchedUser.userId,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: "auth failed, not successful",
      });
    });
});

module.exports = userRoute;
