import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRouter from "./src/routers/auth.router.js";

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use("/users/", userRouter);

app.use((err, req, res, next) => {
    console.log("Internal server error:", err);
    res.status(500).json({success:false, message:"Encountered an error while registering system"});
});

export default app;
