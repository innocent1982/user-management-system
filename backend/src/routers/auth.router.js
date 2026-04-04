const express = require("express");
const userRouter = express.Router();
const { loginUserValidator, signUpValidator } = require("../validators/auth.validator");
const {register, verify, login, logout, refreshToken, forgotPassword, resetPassword } = require("../controllers/auth.controllers");
const {authenticateToken} = require("../middlewares/auth.middleware");
const {checkSchema} =  require("express-validator")


userRouter.post("/register/", signUpValidator, register);
userRouter.post("/verify-email/", verify);
userRouter.post("/login/",loginUserValidator, login);
userRouter.post("/logout/", authenticateToken, logout);
userRouter.post("/refresh-token/", authenticateToken, refreshToken);
userRouter.post("/forgot-password/", checkSchema({email:{isEmail:true}}), forgotPassword);
userRouter.post("/reset-password/", resetPassword);

module.exports = userRouter;