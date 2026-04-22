import express from "express";
import {authenticateToken} from "../middlewares/auth.middleware";
import {get} from "../controllers/user.controllers";

const userRouter = express.Router();

userRouter.get("/me/", authenticateToken, get);
userRouter.put("/me/", authenticateToken, put);





module.exports = userRouter;