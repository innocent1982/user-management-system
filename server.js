const express = require("express");
const userRouter = require("./routers/userRouter");

const port = 3000;
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use("/student/", userRouter);

app.listen(port, ()=> {
    console.log(`Server running on port:${port}`)
});