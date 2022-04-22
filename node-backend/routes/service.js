const axios = require("axios");
require("dotenv").config();
const OTP_KEY = "1724714224731529";
const OTP_SECRET = "3ae964a18447ad4545b15e3648abb059";

module.exports = class ServiceClass {
  async requestOtp(phone_number) {
    const axiosConfig = {
      method: "post",
      url: "https://otp.thaibulksms.com/v2/otp/request",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        key: OTP_KEY,
        secret: OTP_SECRET,
        msisdn: phone_number,
      },
    };
    return await new Promise((resolve, reject) => {
      axios(axiosConfig)
        .then(function (response) {
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    });
  }
  async verifyOTP(token, pin) {
    const axiosConfig = {
      method: "post",
      url: "https://otp.thaibulksms.com/v2/otp/verify",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        key: OTP_KEY,
        secret: OTP_SECRET,
        token: token,
        pin: pin,
      },
    };

    return await new Promise((resolve, reject) => {
      axios(axiosConfig)
        .then(function (response) {
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
};
