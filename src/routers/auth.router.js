const express = require("express");
const userRouter = express.Router();
const { loginUserValidator, signUpValidator } = require("../validators/auth.validator");
const {register, verify, login, logout, refreshToken } = require("../controllers/auth.controller");
const {authenticateToken} = require("../middlewares/auth.middleware");

userRouter.post("/register/", signUpValidator, register);
userRouter.post("/verify-email/", verify);
userRouter.post("/login/",loginUserValidator, login);
userRouter.post("/logout/", authenticateToken, logout);
userRouter.post("/refresh-token/", authenticateToken, refreshToken);

module.exports = userRouter;