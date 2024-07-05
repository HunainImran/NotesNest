require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connection)

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
}));

app.get("/", (req,res) => {
    res.json({payload : "Hello World"});
});

app.listen(8000);
module.exports = app;