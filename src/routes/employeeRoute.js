import express from 'express';
import fileUpload from 'express-fileupload';
import {
    signUp,
    login,
    updateEmployee,
    saveEmployee,
    uploadProfilePicture,
    getProfileDetailsById,
    getUser,
    getLoginUser,
    uploadNewResume,
    sendOTP,
} from '../controllers/employee/employeeController.js';



const router = express.Router();

router.use(fileUpload());
router.post('/signup', signUp);
router.post('/login', login);
router.put('/upload/profile/:id', uploadProfilePicture);
router.put('/upload/resume/:id',  uploadNewResume);
router.post('/save', saveEmployee);
router.get('/user/:id', getUser);
router.put('/update/:id', updateEmployee);
router.get('/users/me', getLoginUser);
router.get('/getdetails/:id', getProfileDetailsById);
router.post('/otpgenerate', sendOTP);

export { router };
