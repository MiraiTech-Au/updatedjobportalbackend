const mongoose = require("mongoose");

const linkedinSchema = new mongoose.Schema({
    linkedinId:String,
    displayName:String,
    email:String,
    image:String
},{timestamps:true});


const linkedindb = new mongoose.model("linkedinauth",linkedinSchema);

module.exports = linkedindb;