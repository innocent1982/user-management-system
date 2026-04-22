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

const authRouter = express.Router();

authRouter.post("/register/", signUpValidator, register);
authRouter.get("/verify-email/", verify);
authRouter.post("/login/",loginUserValidator, login);
authRouter.post("/logout/", authenticateToken, logout);
authRouter.post("/refresh-token/", authenticateToken, refreshToken);
authRouter.post("/forgot-password/", checkSchema({email:{isEmail:true}}), forgotPassword);
authRouter.post("/reset-password/", resetPassword);

export default authRouter;
