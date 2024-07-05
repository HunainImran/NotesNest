const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstName : {type: String},
        LastName : {type: String},
        email : {type: String},
        password : {type: String},
        dateJoined : {type:Date, default: new Date().getTime()},
    }
);

module.exports = mongoose.model("User", userSchema);