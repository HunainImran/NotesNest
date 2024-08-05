require("dotenv").config();
const connection = process.env.connection;
const mongoose = require("mongoose");
const logger = require('./logger');

mongoose.connect(connection)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error('Failed to connect to MongoDB', err));

const user = require("./models/user-schema");
const note = require("./models/note-schema");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./authenticate");

app.use(express.json());
app.use(cors({
    origin: "*",
}));

// Test API
app.get("/", (req, res) => {
    logger.info('Received request at root endpoint');
    res.json({ payload: "Hello World" });
});

// Sign-up API
app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
        logger.error('First Name is required');
        return res.status(400).json({ error: true, message: "First Name is required" });
    }
    if (!lastName) {
        logger.error('Last Name is required');
        return res.status(400).json({ error: true, message: "Last Name is required" });
    }
    if (!email) {
        logger.error('Email is required');
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        logger.error('Password is required');
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        const existingUser = await user.findOne({ email: email });
        if (existingUser) {
            logger.warn('This email address is already registered');
            return res.json({ error: true, message: "This email address is already registered" });
        }

        const newUser = new user({ firstName, lastName, email, password });
        await newUser.save();

        const accessToken = jwt.sign({ newUser }, process.env.TOKEN, { expiresIn: "3600m" });
        logger.info('User has been successfully registered');
        return res.json({ error: false, newUser, accessToken, message: "User has been successfully registered" });
    } catch (err) {
        logger.error('Error in sign-up API', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        logger.error('Email is required');
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        logger.error('Password is required');
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        const existingUser = await user.findOne({ email: email });
        if (!existingUser) {
            logger.error('User not found');
            return res.status(400).json({ error: true, message: "User not found" });
        }
        if (existingUser.email === email && existingUser.password === password) {
            const userData = {
                _id: existingUser._id,
                email: existingUser.email
            };
            const accessToken = jwt.sign(userData, process.env.TOKEN, { expiresIn: "3600m" });
            logger.info('Successfully logged in');
            return res.json({
                error: false,
                message: "Successfully logged in!",
                email,
                accessToken,
            });
        }
        logger.error('Invalid credentials');
        return res.status(400).json({ error: true, message: "Invalid credentials" });
    } catch (err) {
        logger.error('Error in login API', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Add Note API
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user;

    if (!title) {
        logger.error('Title is required');
        return res.status(400).json({ error: true, message: "Title is required" });
    }
    if (!content) {
        logger.error('Content is required');
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const newNote = new note({
            title, content, tags: tags || [], userId: user._id,
        });
        await newNote.save();
        logger.info('Note added successfully');
        return res.json({ error: false, newNote, message: "Note added successfully" });
    } catch (error) {
        logger.error('Error adding note', error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Edit Note API
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;

    logger.info(`Received request to edit note with ID: ${noteId}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    logger.info(`Authenticated user: ${JSON.stringify(user)}`);

    if (!title && !content && !tags) {
        logger.error('No changes provided');
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const existingNote = await note.findOne({ _id: noteId, userId: user._id });
        if (!existingNote) {
            logger.error('Note not found for user ID:', user._id);
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) existingNote.title = title;
        if (content) existingNote.content = content;
        if (tags) existingNote.tags = tags;
        if (typeof isPinned !== 'undefined') existingNote.isPinned = isPinned;

        logger.info('Updated note:', existingNote);
        await existingNote.save();
        logger.info('Note saved successfully');

        return res.json({ error: false, existingNote, message: "Note updated successfully" });
    } catch (err) {
        logger.error('Error updating note', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Get All Notes API
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const user = req.user;

    try {
        const notes = await note.find({ userId: user._id }).sort({ isPinned: -1 });
        logger.info('Notes fetched successfully');
        return res.status(200).json({ error: false, notes, message: "Notes fetched successfully" });
    } catch (err) {
        logger.error('Error fetching notes', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Delete Note API
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try {
        const existingNote = await note.findOne({ _id: noteId, userId: user._id });
        if (!existingNote) {
            logger.error('Note not found');
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        await note.deleteOne({ _id: noteId, userId: user._id });
        logger.info('Note deleted successfully');
        return res.status(200).json({ error: false, message: "Note deleted successfully" });
    } catch (err) {
        logger.error('Error deleting note', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Get User API
app.get("/get-user", authenticateToken, async (req, res) => {
    const currentuser = req.user;

    try {
        const isUser = await user.findOne({ _id: currentuser._id });
        if (!isUser) {
            logger.error('No user found');
            return res.status(401).json({ error: true, message: "No user found" });
        }
        logger.info('User details fetched successfully');
        return res.status(200).json({ firstName: isUser.firstName, lastName: isUser.lastName, email: isUser.email });
    } catch (err) {
        logger.error('Error fetching user details', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Search Note API
app.get('/search-notes', authenticateToken, async (req, res) => {
    const user = req.user;
    const searchQuery = req.query.query;

    if (!searchQuery) {
        logger.error('Search query is required');
        return res.status(400).json({ error: true, message: "Search query is required" });
    }

    try {
        const regex = new RegExp(searchQuery, "i");
        const matchingNotes = await note.find({
            userId: user._id,
            $or: [
                { title: { $regex: regex } },
                { content: { $regex: regex } }
            ]
        });

        logger.info('Notes matching search query retrieved successfully');
        return res.json({ error: false, notes: matchingNotes, message: "Notes matching the search query retrieved successfully" });
    } catch (err) {
        logger.error('Error searching notes', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Pin Note API
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const user = req.user;

    try {
        const existingNote = await note.findOne({ _id: noteId, userId: user._id });
        if (!existingNote) {
            logger.error('Note not found for user ID:', user._id);
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        existingNote.isPinned = isPinned;

        logger.info('Updated note:', existingNote);
        await existingNote.save();
        logger.info('Note updated successfully');

        return res.json({ error: false, existingNote, message: "Note updated successfully" });
    } catch (err) {
        logger.error('Error updating note', err);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.listen(8000, () => logger.info('Server listening on port 8000'));

module.exports = app;
