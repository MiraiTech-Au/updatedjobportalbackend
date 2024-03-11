const Employee = require('../models/employeeModel')
const bcrypt = require('bcrypt')
const OTP = require('../models/Otp')
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken'); // Make sure to require jwt
const azureBlobService = require('../services/azureBlobService');


//send otp 
exports.sendOTP = async(req,res)=>{
  try{
      const {email}= req.body;
      
      const checkUserPresent = await Employee.findOne({ 'personalDetails.email': email })
      
      if(checkUserPresent)
      {
          return res.status(401).json({
              success:false,
              message:"User already exists"
          })
      }
      //generate otp
      var otp = otpGenerator.generate(6,{
          upperCaseAlphabets:false,
          lowerCaseAlphabets:false,
          specialChars:false
      })
    
      const result = await OTP.findOne({otp:otp})

      while(result){
          otp = otpGenerator.generate(6,{
              upperCaseAlphabets:false,
              lowerCaseAlphabets:false,
              specialChars:false
          })
          result = await OTP.findOne({otp:otp})
      }

      const otpPayload = {email,otp}
      const otpBody = await OTP.create(otpPayload)
     
      res.status(200).json({
          success:true,
          message:'OTP sent successfully'
      })

  }
  catch(err)
  {
      res.status(500).json({
                  success:false,
                  message:err.message
              })
  }
}

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword,otp } = req.body.personalDetails;

    // Check if all fields are provided
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password doesn't match"
      });
    }

    // Check if user already exists
    const existsUser = await Employee.findOne({ 'personalDetails.email': email });
    if (existsUser) {
      return res.status(401).json({
        success: false,
        message: "User already registered"
      });
    }

      //get most recent otp
      const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  
  
      if (recentOTP.length == 0) {
          return res.status(400).json({
              success: false,
              message: "OTP not found"
          });
      } else if (otp !== recentOTP[0].otp) {
          return res.status(400).json({
              success: false,
              message: "Invalid OTP"
          });
      }



    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employee
    const employee = new Employee({
      personalDetails: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone:null
        // ... other personal details
      },
      // ... other fields
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    // Save the employee
    const emp = await employee.save();
  

    // Return response (excluding sensitive data)
    return res.status(201).json({ 
      success: true, 
      message: 'Employee created', 
      emp
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    // Find employee by email
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find employee by email
    const employee = await Employee.findOne({ 'personalDetails.email': req.body.email });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: 'Cannot find employee'
      });
    }
    console.log(employee);
    if (!employee.personalDetails.password) {
      return res.status(400).json({
        success: false,
        message: 'Employee password not set'
      });
    }
    // Check password
    if (await bcrypt.compare(req.body.password, employee.personalDetails.password)) {
      // Generate JWT token
      const payload = {
        id: employee._id,
        email: employee.personalDetails.email,
        // Add other necessary fields from employee details
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h' // Adjust the duration as per your requirement
      });

      // res.cookie('accessToken', accessToken, options1);
      res.header('Authorization', `Bearer ${accessToken}`);
      res.header('RefreshToken', `Refresh ${refreshToken}`);
      res.status(200).json({
        success: true,
        employee,
        token: token,
        message: 'Logged in successfully'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
  } catch (error) {
    console.error(error); // Consider using a more sophisticated logging mechanism
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  } 
}

exports.generateAccessToken = async(req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  // Validate Refresh Token
  // Here, also check if the refresh token exists in the database or wherever it's stored
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ accessToken });
  });
};

const isImageFile = (file) => {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return imageMimeTypes.includes(file.mimetype);
};

const isDocumentFile = (file) => {
  const documentMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return documentMimeTypes.includes(file.mimetype);
};

exports.uploadProfile = async (req, res) => {
  try {
    const updateData = req.body; // or any other data you need to update
    const employeeId = req.params.id;
    if (req.file) {
      let blobUrl;

          if (isImageFile(req.file)) {
              blobUrl = await azureBlobService.uploadImage(req.file);
              updateData.image = blobUrl;
          } else {
              return res.status(400).json({ error: 'Unsupported file type' });
          } 
       }
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const updateData = req.body; // or any other data you need to update
    const employeeId = req.params.id;
    if (req.file) {
      if (isDocumentFile(req.file)) {
        blobUrl = await azureBlobService.uploadDoc(req.file);
        updateData.resume = blobUrl;
        } else {
            return res.status(400).json({ error: 'Unsupported file type' });
        } // Assuming 'profileImageUrl' is the field in Employee model
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfileDetails = async (req, res) => {
  try {
      const employeeId = req.params.id; // Assuming ID is passed as a URL parameter
      let updateData = req.body;
      if (updateData.personalDetails && updateData.personalDetails.password === undefined) {
        const currentEmployee = await Employee.findById(employeeId);
        if (!currentEmployee) {
          // Handle case where the employee is not found
          return res.status(404).json({ message: "Employee not found" });
        }
    
        // Set the existing password in the update data
        updateData.personalDetails.password = currentEmployee.personalDetails.password;
      }

     
  
      const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Exclude the password field from the response
    if (updatedEmployee.personalDetails && updatedEmployee.personalDetails.password) {
      updatedEmployee.personalDetails.password = undefined;
    }

    // Return the updated employee data without the password
    res.status(200).json(updatedEmployee);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

exports.getProfileDetailsById = async (req, res) => {
  try {
      const employeeId = req.params.id; // Assuming the ID is passed as a URL parameter
      const employee = await Employee.findById(employeeId);

      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      res.json(employee);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.getAllEmployee = async (req, res) => {
  try {
    console.log(' http://localhost:9000');
      const employees = await Employee.find();

      res.json(employees);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};
