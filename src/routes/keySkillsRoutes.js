import { Router } from 'express';
import fs from 'fs';
import { promisify } from 'util';
import KeySkill from '../models/skillSetModal.js';
import { errorResponse, successResponse } from '../utils/helpers.js';

const router = Router();

const readFileAsync = promisify(fs.readFile);

router.post('/', async (req, res) => {
    // Expecting req.body to be an array of key skills
    const skills = await readFileAsync('dataFormat.json', 'utf-8');
    const parsedSkills = JSON.parse(skills);
    const keySkills = parsedSkills;

    try {
        // Validate input to ensure it's an array
        if (!Array.isArray(keySkills)) {
            // logger.error(
            //   `${moduleNames[0]} - Post-Status:${400}, Error:${JSON.stringify(
            //     "Input should be an array of key skills"
            //   )}`
            // );
            return errorResponse(
                res,
                400,
                'Input should be an array of key skills.'
            );
        }

        // Optional: Add validation here to check each object in the array
        // for the expected structure ({ label: 'string', value: 'string' })

        const inserted = await KeySkill.insertMany(keySkills);
        // logger.info(`${moduleNames[0]} - Get. Success:${JSON.stringify(inserted)}`);
        return successResponse(res, 200, '', inserted);
    } catch (error) {
        // logger.error(
        //     `${moduleNames[0]} - Get-Status:${500}, Error:${JSON.stringify(
        //       "Employee not found"
        //     )}`
        //   );
        return errorResponse(res, 400, error.message);
    }
});

router.get('/', async (req, res) => {
    const { searchTerm } = req.query;

    try {
        if (!searchTerm) {
            // logger.error(
            //   `Get-Status:${400}, Error:${JSON.stringify(
            //     "A search term is required"
            //   )}`
            // );
            return errorResponse(res, 400, 'A search term is required.');
        }

        // Perform a case-insensitive search and limit results to 10
        const skills = await KeySkill.find({
            label: { $regex: new RegExp(searchTerm, 'i') },
        }).limit(10);
        return successResponse(res, 200, '', skills);
    } catch (error) {
        // logger.error(
        //   `${moduleNames[0]} - Get-Status:${500}, Error:${JSON.stringify(
        //     error.message
        //   )}`
        // );
        return errorResponse(res, 500, error.message);
    }
});

export default router;
