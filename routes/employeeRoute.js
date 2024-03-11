const express = require("express");
const {
  signup,
  login,
  updateProfileDetails,
  getProfileDetailsById,
  uploadProfile,
  uploadResume,
  getAllEmployee,
  generateAccessToken,
  sendOTP,
} = require("../controllers/employeeController");
const router = express.Router();
const multer = require("multer");
const authenticateToken = require("../middleware/tokenValidator");
const upload = multer({ dest: "uploads/" }); // This saves files to 'uploads/' folder

//auth user routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/token", generateAccessToken);
router.put("/upload/profile/:id", upload.single("image"), uploadProfile);
router.put("/upload/resume/:id", upload.single("resume"), uploadResume);
router.put("/updatedetails/:id", authenticateToken, updateProfileDetails);
router.get("/getdetails/:id", getProfileDetailsById);
router.get("/user", getAllEmployee);

//send otp
router.post("/otpgenerate", sendOTP);

module.exports = router;
