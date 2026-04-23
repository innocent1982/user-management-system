import express from "express";
import {get, updateUser, deleteUser} from "../controllers/user.controllers.js";
import {userValidator} from "../validators/auth.validator.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/me/", authenticateToken, get);
userRouter.put("/me/", authenticateToken, userValidator, updateUser);
userRouter.delete("/me/delete/", authenticateToken, deleteUser);

export default userRouter;