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
    getResumes,
} from '../controllers/employee/employeeController.js';
import authenticateToken from '../middleware/tokenValidator.js';



const router = express.Router();
const auth = authenticateToken

router.use(fileUpload());
router.post('/signup', signUp);
router.post('/login', login);
router.put('/upload/profile/:id',auth, uploadProfilePicture);
router.put('/upload/latestresume/:id',  auth , uploadNewResume);
router.get("/get/resume/:id", getResumes);
router.post('/save', auth, saveEmployee);
router.get('/user/:id', auth, getUser);
router.put('/update/:id', auth,updateEmployee);
router.get('/users/me', auth, getLoginUser);
router.get('/getdetails/:id',auth, getProfileDetailsById);
router.post('/otpgenerate', auth, sendOTP);

export { router };
