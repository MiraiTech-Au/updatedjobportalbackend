// const mongoose = require('mongoose');
import mongoose from "mongoose";

const keySkillSchema = new mongoose.Schema({
  label: String,
  value: String
});

const KeySkill = mongoose.model('KeySkill', keySkillSchema);
export default KeySkill