// const mongoose = require('mongoose');
import mongoose  from "mongoose";

const employeeSchema = new mongoose.Schema({
  personalDetails: {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    // Add more personal details as needed
  },
  image:String,
  aboutUs: String,
  education: [{
    degree: String,
    institution: String,
    year: String,
    // Add more fields as needed
  }],
  experience: [{
    company: String,
    role: String,
    duration: String,
    // Add more fields as needed
  }],
  skills: [String],
  resume:String
  // Add other fields as needed
});


const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
