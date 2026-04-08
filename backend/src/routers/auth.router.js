import express from "express";
import { checkSchema } from "express-validator";
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  verify,
} from "../controllers/auth.controllers.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { loginUserValidator, signUpValidator } from "../validators/auth.validator.js";

const userRouter = express.Router();

userRouter.post("/register/", signUpValidator, register);
userRouter.post("/verify-email/", verify);
userRouter.post("/login/",loginUserValidator, login);
userRouter.post("/logout/", authenticateToken, logout);
userRouter.post("/refresh-token/", authenticateToken, refreshToken);
userRouter.post("/forgot-password/", checkSchema({email:{isEmail:true}}), forgotPassword);
userRouter.post("/reset-password/", resetPassword);

export default userRouter;
