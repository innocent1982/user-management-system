import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./src/routers/auth.router.js";

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
app.use("/auth/", authRouter);

app.use((err, req, res, next) => {
    console.log("Internal server error:", err);
    res.status(500).json({success:false, message:"Encountered an error while registering system"});
});

export default app;
