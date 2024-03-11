const mongoose = require("mongoose");

const googleSchema = new mongoose.Schema({
    googleId:String,
    displayName:String,
    email:String,
    image:String
},{timestamps:true});


const googledb = new mongoose.model("googleauth",googleSchema);

module.exports = googledb;