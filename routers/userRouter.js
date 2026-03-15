const express = require("express");
const userRouter = express.Router();
const { userValidator } = require("../services/validators/userValidator");
const {register, verifyEmail } = require("../controllers/userController");

userRouter.post("/register/", userValidator, register);
userRouter.get("/verify-email/", verifyEmail)

module.exports = userRouter;