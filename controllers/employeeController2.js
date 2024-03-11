const User = require("../models/employeeModal2");
const bcrypt = require("bcrypt");
const azureBlobService = require("../services/azureBlobService");
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
  try {
    const { email, password, confirmPassword, personalInfo } = req.body;

    // Destructure personalInfo to extract firstName, lastName, and primaryContact
    const { firstName, lastName, primaryContact } = personalInfo || {};

    // Validate required fields
    if (!email || !password || !confirmPassword || !firstName || !lastName || !primaryContact) {
      return res.status(400).json({ error: "Please fill all the required fields" });
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName + ' ' + lastName)}`;
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
      expiresIn: '2h' // Adjust the duration as per your requirement
    });

    res.header('Authorization', `Bearer ${token}`);

    res.status(201).json({ message: "Signup successful", user: savedUser });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).send("Internal Server Error");
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      // Add other necessary fields from employee details
    };

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h' // Adjust the duration as per your requirement
    });

    res.header('Authorization', `Bearer ${token}`);


    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.saveEmployee = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error on getting user", error);
    res.status(500).send("User not found");
  }
};

exports.getLoginUser = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decode.id);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error on getting user", error);
    res.status(500).send("User not found");
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;


    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const isImageFile = (file) => {
  const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  return imageMimeTypes.includes(file.mimetype);
};
const isDocumentFile = (file) => {
  const documentMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return documentMimeTypes.includes(file.mimetype);
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const updateData = req.body; // or any other data you need to update
    const employeeId = req.params.id;

    let blobUrl;
    if (req.file) {
      if (isImageFile(req.file)) {
        blobUrl = await azureBlobService.uploadImage(req.file);
        updateData.profileImage = blobUrl;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    }
    const user = await User.findByIdAndUpdate(
      employeeId,
      { profileImage: blobUrl },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadNewResume = async (req, res) => {
  try {
    const updateData = req.body; // or any other data you need to update
    const employeeId = req.params.id;
    if (req.file) {
      if (isDocumentFile(req.file)) {
        blobUrl = await azureBlobService.uploadDoc(req.file);
        updateData.profileResume = blobUrl;
        } else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
    }
    const updatedEmployee = await User.findByIdAndUpdate(employeeId, {profileResume:blobUrl}, { new: true });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProfileDetailsById = async (req, res) => {
  try {
      const employeeId = req.params.id; // Assuming the ID is passed as a URL parameter
      const employee = await User.findById(employeeId);

      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      res.json(employee);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};