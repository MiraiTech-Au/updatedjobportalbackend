const express = require('express');
const router = express.Router();
const KeySkill = require('../models/skillSetModal');

const fs = require("fs");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);

router.post('/', async (req, res) => {
  // Expecting req.body to be an array of key skills
  const skills = await readFileAsync("dataFormat.json", "utf-8");
    const parsedSkills = JSON.parse(skills);
  const keySkills = parsedSkills;

  try {
    // Validate input to ensure it's an array
    if (!Array.isArray(keySkills)) {
      return res.status(400).send('Input should be an array of key skills.');
    }

    // Optional: Add validation here to check each object in the array
    // for the expected structure ({ label: 'string', value: 'string' })

    const inserted = await KeySkill.insertMany(keySkills);
    res.send(inserted);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/', async (req, res) => {
  const searchTerm = req.query.searchTerm;

  try {
    if (!searchTerm) {
      return res.status(400).send('A search term is required.');
    }

    // Perform a case-insensitive search and limit results to 10
    const skills = await KeySkill.find({ 
      label: { $regex: new RegExp(searchTerm, 'i') } 
    }).limit(10);

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;