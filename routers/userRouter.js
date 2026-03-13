const express = require("express");
const userRouter = express.Router();
const { userValidator, emailInputValidator } = require("../services/validators/userValidator");
const {register, initiateEmailVerification, verifyEmail } = require("../controllers/userController");

userRouter.post("/register/", userValidator, register);
userRouter.post("/initiate-verify-email/", emailInputValidator, initiateEmailVerification);
userRouter.get("/verify-email/", verifyEmail)

module.exports = userRouter;