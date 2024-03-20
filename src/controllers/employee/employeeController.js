import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import Employee from '../../models/employeeModel.js';
import User from '../../models/userModal.js';
import bcrypt from 'bcrypt';
import OTP from '../../models/Otp.js';
import { uploadDoc, uploadImage } from '../../services/azureBlobService.js';
import { LoginValidation, SingInValidation } from './validationSchema.js';
import { responseType } from '../../utils/enums.js';
// import logger from "../../../logger.js";
import { errorResponse, successResponse } from '../../utils/helpers.js';
//send otp
export const sendOTP = async (req, res) => {
    try {
  const { email } = req.body;
        const checkUserPresent = await Employee.findOne({
            'personalDetails.email': email,
        });

        if (checkUserPresent) {
            // logger.error(
            //   `${moduleNames[1]} - Signup- Status:${400}, Error:${JSON.stringify(
            //     errorMessage
            //   )}`
            // );
            return errorResponse(res, 400, 'User already exists');
        }
        //generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };
        await OTP.create(otpPayload);
        return successResponse(res, 200, 'OTP sent successfully', null);
    } catch (err) {
        return errorResponse(res, 500, responseType[4], err.message);
    }
};

export const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, personalInfo } = req.body;

        // Destructure personalInfo to extract firstName, lastName, and primaryContact
        const { firstName, lastName, primaryContact } = personalInfo || {};
        const validate = SingInValidation.validate(req?.body);
        // Validate required fields
        if (validate.length) {
            const errorMessage = validate.map((error) => error.message);
            // logger.error(
            //   `${moduleNames[1]} - Signup- Status:${400}, Error:${JSON.stringify(
            //     errorMessage
            //   )}`
            // );
            return errorResponse(res, 400, responseType[4], errorMessage);
        }
        if (password !== confirmPassword) {
            return errorResponse(
                res,
                400,
                'password and confirmPassword is not match'
            );
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
            firstName
        )}`;

        const newUser = new User({
            email,
            password: hashedPassword,
            personalInfo: {
                firstName, // Using shorthand for firstName: firstName,
                lastName,
                primaryContact,
            },
            profileImage: profileImageUrl,
        });

        const savedUser = await newUser.save();
        const payload = {
            id: savedUser._id,
            email: savedUser.email,
            // Add other necessary fields from employee details
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h', // Adjust the duration as per your requirement
        });

        res.header('Authorization', `Bearer ${token}`);
        return successResponse(res, 201, 'Signup successful', savedUser);
        // res.status(201).json({ message: "Signup successful", user: savedUser });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors)[0].message;
            return errorResponse(res, 400, errorMessage);
        }
        console.error('Error signing up:', error);
        return errorResponse(res, 500, error.message);
    }
};

export const generateAccessToken = async (req, res) => {
        const refreshToken = req.body.token;
            if (!refreshToken) return res.sendStatus(401);

         // Validate Refresh Token
        // Here, also check if the refresh token exists in the database or wherever it's stored
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);

            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '2h',
             });
        return res.json({ accessToken });
    });
    return;
};

export const login = async (req, res) => {
    try {
        // Find employee by email
        const { email, password } = req.body;

        const validate = LoginValidation.validate(req.body);
        if (validate.length) {
            const errorMessage = validate.map((error) => error.message);
            // logger.error(
            //   `${moduleNames[1]} - Signup- Status:${400}, Error:${JSON.stringify(
            //     errorMessage
            //   )}`
            // );
            return errorResponse(res, 400, responseType[4], errorMessage);
        }
        // Find employee by email
        const employee = await User.findOne({ email });
        console.log('employee------->', employee);

        if (!employee) {
            return errorResponse(res, 400, 'Cannot find employee');
        }
        if (!employee.password) {
            return errorResponse(res, 400, 'Employee password not set');
        }

        // Check password
        if (await bcrypt.compare(password, employee.password)) {
            // Generate JWT token
            const payload = {
                id: employee._id,
                email: employee.email,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h', // Adjust the duration as per your requirement
            });
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateAccessToken(payload);
            res.header('Authorization', `Bearer ${accessToken}`);
            res.header('RefreshToken', `Refresh ${refreshToken}`);
            return successResponse(res, 200, 'Logged in successfully', {
                success: true,
                employee: employee,
                token: token,
                message: 'Logged in successfully',
            });
        } else {
            return errorResponse(res, 401, 'Password is incorrect');
        }
    } catch (error) {
        console.error(error); // Consider using a more sophisticated logging mechanism
        return errorResponse(res, 500, 'An error occurred during login');
    }
};

export const getLoginUser = async (req, res) => {
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);
        // logger.info(`${moduleNames[0]} - Get. Success:${JSON.stringify(user)}`);
        successResponse(res, 200, 'Get user successfully', user);
    } catch (error) {
        // logger.error(
        //   `${moduleNames[0]} - Get-Status:${500}, Error:${JSON.stringify(
        //     error.message
        //   )}`
        // );
        errorResponse(res, 500, error.message);
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUserData = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedUserData,
            {
                new: true,
            }
        );

        if (!updatedUser) {
            // logger.error(
            //   `${moduleNames[0]} - Update-Status:${400}, Error:${JSON.stringify(
            //     responseType[8]
            //   )}`
            // );
            return errorResponse(res, 400, responseType[8]);
        } else {
            // logger.info(
            //   `${moduleNames[1]} - Update. Success:${JSON.stringify(updatedUser)}`
            // );
            return successResponse(
                res,
                200,
                'User update successfully',
                updatedUser
            );
        }
    } catch (error) {
        // logger.error(
        //   `${moduleNames[0]} - Update-Status:${400}, Error:${JSON.stringify(error)}`
        // );
        return errorResponse(res, 500, error.message);
    }
};

const isImageFile = (file) => {
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return imageMimeTypes.includes(file.mimetype);
};

export const uploadProfilePicture = async (req, res) => {
    try {
        const updateData = req.body; // or any other data you need to update
        const employeeId = req.params.id;
        console.log(updateData, updateData);
        let blobUrl;
        if (req.file) {
            if (isImageFile(req.file)) {
                blobUrl = await uploadImage(req.file);
                updateData.profileImage = blobUrl;
            } else {
                // logger.error(
                //   `${moduleNames[1]} - Update-Status:${400}, Error:${JSON.stringify(
                //     responseType[9]
                //   )}`
                // );
                return errorResponse(res, 400, responseType[9]);
            }
        }
        const user = await User.findByIdAndUpdate(
            employeeId,
            { profileImage: blobUrl },
            { new: true }
        );
        // logger.info(`${moduleNames[1]} - Update. Success:${JSON.stringify(user)}`);
        return successResponse(
            res,
            200,
            'Profile picture updated successfully',
            user
        );
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

const isDocumentFile = (file) => {
    const documentMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return documentMimeTypes.includes(file.mimetype);
};

export const uploadNewResume = async (req, res) => {
    try {
        const updateData = req.body; // or any other data you need to update
        const employeeId = req.params.id;
        let blobUrl;
        if (req.file) {
            if (isDocumentFile(req.file)) {
                blobUrl = await uploadDoc(req.file);
                updateData.profileResume = blobUrl;
            } else {
                // logger.error(
                //   `${moduleNames[1]} - Update-Status:${400}, Error:${JSON.stringify(
                //     responseType[9]
                //   )}`
                // );
                return errorResponse(res, 400, responseType[9]);
            }
        }

        const updatedEmployee = await User.findByIdAndUpdate(
            employeeId,
            { profileResume: blobUrl },
            { new: true }
        );
        // logger.info(
        //   `${moduleNames[1]} - Update. Success:${JSON.stringify(updatedEmployee)}`
        // );
        return successResponse(
            res,
            200,
            'Resume uploaded successfully',
            updatedEmployee
        );
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

export const getProfileDetailsById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await User.findById(employeeId);
        if (!employee) {
            // logger.error(
            //   `${moduleNames[0]} - Get-Status:${500}, Error:${JSON.stringify(
            //     "Employee not found"
            //   )}`
            // );
            return errorResponse(res, 404, 'Employee not found');
        }
        // logger.info(`${moduleNames[0]} - Get. Success:${JSON.stringify(employee)}`);
        return successResponse(
            res,
            200,
            'Profile details get successfully',
            employee
        );
    } catch (err) {
        // logger.error(
        //   `${moduleNames[0]} - Update-Status:${500}, Error:${JSON.stringify(
        //     err.message
        //   )}`
        // );
        return errorResponse(res, 500, err.message);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        // logger.info(`${moduleNames[0]} - Get. Success:${JSON.stringify(user)}`);
        return successResponse(res, 200, 'User get successfully', user);
    } catch (error) {
        console.error('Error on getting user', error);
        // logger.error(
        //   `${moduleNames[0]} - Update-Status:${500}, Error:${JSON.stringify(
        //     error.message
        //   )}`
        // );
        return errorResponse(res, 500, error.message);
    }
};

export const saveEmployee = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        // logger.info(
        //   `${moduleNames[2]} - Update. Success:${JSON.stringify(savedUser)}`
        // );
        return successResponse(res, 200, 'User save successfully', savedUser);
    } catch (error) {
        // logger.error(
        //   `${moduleNames[0]} - Update-Status:${400}, Error:${JSON.stringify(
        //     error.message
        //   )}`
        // );
        return errorResponse(res, 400, error.message);
    }
};
