const mongoose = require('mongoose');

const keySkillSchema = new mongoose.Schema({
  label: String,
  value: String
});

module.exports = mongoose.model('KeySkill', keySkillSchema);
