const express = require("express");
const userRouter = express.Router();
const { loginUserValidator, signUpValidator } = require("../validators/auth.validator");
const {register, verify, login } = require("../controllers/auth.controller");

userRouter.post("/register/", signUpValidator, register);
userRouter.post("/verify-email/", verify);
userRouter.post("/login/",loginUserValidator, login);

module.exports = userRouter;