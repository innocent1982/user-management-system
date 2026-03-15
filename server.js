const express = require("express");
const userRouter = require("./routers/userRouter");
const courseRouter = require("./routers/courseRouter");
require("dotenv").config();

const port = 3000;
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use("/student/", userRouter);
app.use("/course/", courseRouter);

app.listen(port, ()=> {
    console.log(`Server running on port:${port}`)
});