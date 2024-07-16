const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstName : {type: String},
        lastName : {type: String},
        email : {type: String},
        password : {type: String},
        dateJoined : {type:Date, default: new Date().getTime()},
    }
);

module.exports = mongoose.model("User", userSchema);