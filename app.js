const express = require("express");
const userRouter = require("./src/routers/auth.router");
require("dotenv").config();

const port = 3000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use("/users/", userRouter);

app.use((err, req, res, next) => {
    console.log("Internam server error:", err);
    res.status(500).json({success:false, message:"Encountered an error while registering system"})
})

/*app.listen(port, ()=> {
    console.log(`Server running on port:${port}`)
});
*/
module.exports = app;
