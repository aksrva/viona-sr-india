const express = require('express');
const app = express();
const PORT = process.env.PORT | 2999;
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const { createUser } = require('../controller/Users');
const userRouter = require('../routes/Users');

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// users middleware
app.use("/users", userRouter.router);


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/srIndia');
    console.log("Server connected");
}
main().catch(err => console.log("Database error : " + err));

app.listen(PORT, () => {
    console.log("Server is listen at port " + PORT);
});