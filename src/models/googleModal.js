// const mongoose = require("mongoose");
 import mongoose from "mongoose";
 
const googleSchema = new mongoose.Schema({
    googleId:String,
    displayName:String,
    email:String,
    image:String
},{timestamps:true});


const googledb = new mongoose.model("googleauth",googleSchema);

export default googledb