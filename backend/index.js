require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connection)

const user = require("./models/user-schema");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require ("jsonwebtoken");
const {authenticateToken} = require("./authenticate"); 

app.use(express.json());
app.use(cors({
    origin: "*",
}));

//test api
app.get("/", (req,res) => {
    res.json({payload : "Hello World"});
});

//Sign-up api
app.post("/signup", async (req,res) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName){
        return res.status(400).json({error:true, message:"First Name is required"})
    }
    if(!lastName){
        return res.status(400).json({error:true, message:"last Name is required"})
    }
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"})
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"})
    }
    const existingUser = await user.findOne({email : email});
    if(existingUser){
        return res.json({error: true, message: "This email address is already registered"});
    }
    newUser = new user({firstName, lastName, email, password});
    await newUser.save();

    const accessToken = jwt.sign({newUser}, process.env.TOKEN, {expiresIn: "3600m",});
    return res.json({error:false, newUser, accessToken, message: "User has been successfully registered"});

});

//Login API
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"});
    }

    const existingUser = await user.findOne({email:email});
    if(!existingUser){
        return res.status(400).json({error:true, message:"User not found"});
    }
    if(existingUser.email == email && existingUser.password == password){
        const userData = {user: existingUser};
        const accessToken = jwt.sign(userData, process.env.TOKEN, {
            expiresIn: "3600m",
        });
        return res.json({
            error: false,
            message : "Successfully logged in!",
            email,
            accessToken,
        });
    }
    return res.status(400).json({
        error: true, message:"Invalid credentials",
    });
});

app.listen(8000);
module.exports = app;