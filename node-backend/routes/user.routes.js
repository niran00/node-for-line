const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
let checkAuth = require("../middleware/check-auth.js");
const userRoute = express.Router();
let User = require("../model/user.js");
let ServiceClass = require("./service");
const service = new ServiceClass();

const line = require("@line/bot-sdk");

const chanToken =
  "/ufTwLtxJhJZdtzpSvYWASESMtoCwVCUsLVxK53VwTEdwakV4bms8orkp+T+yafQ4oBZHFx6KN316jLQeUIa5bIOQ+pRMfVf5S8SK4FxDTNxmtci12S1fXhn95HLT8GhDizvPs4MGqSkkspSqWwHDgdB04t89/1O/w1cDnyilFU=";
const secretToken = "37c342cbd514b4d228f09eb89dadef90";

const client = new line.Client({
  channelAccessToken: chanToken,
  channelSecret: secretToken,
});

// OTP Request
userRoute.route("/verify").post((req, res, next) => {
  User.findOne(
    { userPhoneNumber: req.body.userPhoneNumber },
    async function (err, foundUser) {
      if (!foundUser) {
        console.log("Number Not Found");
        // let fireOtp = await service.requestOtp(req.body.userPhoneNumber);
        let fireOtp = {
          status: "success",
          token: "654321",
          refno: "654321",
        };
        return res.status(200).json({
          otpTok: fireOtp.token,
          otpPin: fireOtp.refno,
        });
      } else {
        console.log("Number exists");
        return res.status(200).json({
          otpTok: "none",
        });
      }
    }
  );
});

// Add User
userRoute.route("/add-user").post(async (req, res, next) => {
  let data = req.body;
  let userDr = data[0];
  let pin = data[1];
  let token = data[2];
  // let verify = await service.verifyOTP(token, pin);

  const lineUserId = "U4a20ad686ba7827c293b71dc77930331";
  client.linkRichMenuToUser(
    lineUserId,
    "richmenu-5958821b45ace6ace7704ab191673476"
  );

  let verify = {
    status: "success",
    token: "654321",
    refno: "654321",
  };

  if (verify.status == "success") {
    User.create(userDr, (error, data) => {
      if (error) {
        console.log("no");
        console.log(userDr);
        return next(error);
      } else {
        res.json(userDr);
        console.log(userDr);
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
      $set: {
        userName: req.body.userName,
      },
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

// OTP Request - New Number
userRoute.route("/verify-new-number").post(async (req, res, next) => {
  User.findOne(
    { userPhoneNumber: req.body.userPhoneNumber },
    async function (err, foundUser) {
      if (!foundUser) {
        console.log("Number Not Found");
        // let fireOtp = await service.requestOtp(req.body.userPhoneNumber);
        // let fireOtp = {
        //   status: "success",
        //   token: "kRpKN6vjmAr7Y6AF7I63BbEwMVq845nx",
        //   refno: "3L31J",
        // };
        return res.status(200).json({
          otpTok: fireOtp.token,
          otpPin: fireOtp.refno,
        });
      } else {
        console.log("Number exists");
        return res.status(200).json({
          otpTok: "none",
        });
      }
    }
  );
});

// Update User Number
userRoute.route("/update-new-number/:id").put(async (req, res, next) => {
  let data = req.body;
  let userDr = data[1];
  let pin = data[2];
  let token = data[3];
  let verify = await service.verifyOTP(token, pin);

  // let verify = {
  //   status: "success",
  //   token: "test123",
  //   refno: "654321",
  //   pin: "654321",
  // };

  if (verify.status == "success") {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: userDr,
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

    // User.create(userDr, (error, data) => {
    //   if (error) {
    //     console.log("no");
    //     console.log(userDr);
    //     return next(error);
    //   } else {
    //     res.json(userDr);
    //     console.log("pass");
    //   }
    // });
  } else {
    console.log(pin);
    console.log(verify);
  }
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
  const lineUserId = req.body.userId;
  const toRich = "richmenu-0b0eb4b6a40329dc08041d3580cf41f8";
  client.linkRichMenuToUser(lineUserId, toRich);

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
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: "auth failed, not successful",
      });
    });
});

module.exports = userRoute;
