const express = require("express");
const userRouter = express.Router();
const { loginUserValidator, signUpValidator } = require("../services/validators/userValidator");
const {register, verify, login } = require("../controllers/userController");

userRouter.post("/register/", signUpValidator, register);
userRouter.get("/verify-email/", verify);
userRouter.get("/login/",loginUserValidator, login);

module.exports = userRouter;