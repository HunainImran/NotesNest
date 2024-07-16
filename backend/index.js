require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connection)

const user = require("./models/user-schema");
const note = require("./models/note-schema");

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
        const userData = {
            _id: existingUser._id,
            email: existingUser.email
        };
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

//Add note api
app.post("/add-note", authenticateToken, async (req,res) => {
    const {title, content, tags} = req.body;
    const user = req.user;
    if(!title){
        return res.status(400).json({error:true, message: "Title is required"});
    }
    if(!content){
        return res.status(400).json({error:true, message: "Content is required"});
    }
    try{
        const newNote = new note({
            title, content, tags: tags || [], userId: user._id,
        });
        await newNote.save()
        return res.json({error: false, newNote, message: "Note added successfully",});
    }
    catch (error){
        console.error("Error adding note:", error);
        return res.status(500).json({
            error:true,
            message: "Internal server error",
        });
    }
});


//Edit Note Api
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user; // Note the correction here

    console.log("Received request to edit note with ID:", noteId);
    console.log("Request body:", req.body);
    console.log("Authenticated user:", user);

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const existingNote = await note.findOne({ _id: noteId, userId: user._id });
        if (!existingNote) {
            console.log("Note not found for user ID:", user._id);
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) existingNote.title = title;
        if (content) existingNote.content = content;
        if (tags) existingNote.tags = tags;
        if (typeof isPinned !== 'undefined') existingNote.isPinned = isPinned; // Use typeof to check for boolean

        console.log("Updated note:", existingNote);

        await existingNote.save();
        console.log("Note saved successfully");

        return res.json({ error: false, existingNote, message: "Note updated successfully" });
    } catch (err) {
        console.error("Error updating note:", err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

//Get all notes Api
app.get("/get-all-notes/", authenticateToken, async (req,res) =>{
    const user = req.user;
    try{
        const notes = await note.find({userId : user._id,}).sort({isPinned: -1});
        return res.status(200).json({error:false, notes, message:"Notes fetched successfully"});
    }
    catch(err){
        return res.status(500).json({error:true,message: "Internal server error"});
    }
});

//Delete Note Api
app.delete("/delete-note/:noteId", authenticateToken, async (req,res) => {
    const noteId = req.params.noteId;
    const user = req.user;
    try{
        const existingNote = await note.findOne({ _id: noteId, userId: user._id });
        if(!existingNote){
            return res.status(404).json({error:true, message:"Note not found"});
        }
        await note.deleteOne({ _id: noteId, userId: user._id });
        return res.status(200).json({error:false, message:"Note deleted successfully"});
    }
    catch(err){
        return res.status(500).json({error:true,message: "Internal server error"});
    }
});

app.listen(8000);
module.exports = app;