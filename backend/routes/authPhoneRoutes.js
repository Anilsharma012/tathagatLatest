const express = require("express");
const router = express.Router();
const authPhoneController = require("../controllers/authPhoneController");

router.post("/send-otp", authPhoneController.sendPhoneOtp);
router.post("/mobileVerify-otp", authPhoneController.verifyPhoneOtp);
router.post("/login-phone", authPhoneController.loginWithPhone);
router.post("/register", authPhoneController.registerWithPhone);
router.post("/verify-registration", authPhoneController.verifyRegistrationOtp);
router.post("/login-password", authPhoneController.loginWithPassword);

module.exports = router;
