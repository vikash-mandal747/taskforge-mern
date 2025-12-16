const express = require("express");

const userRouter = express.Router();

const { registerUser, loginUser } = require("../controllers/user.controller");

//register user
userRouter.post("/register", registerUser); 
// Login user
userRouter.post("/login", loginUser);

module.exports = userRouter;