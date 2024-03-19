import express from "express";
import multer from "multer";
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
} from "../controllers/employee/employeeController.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/upload/profile/:id", upload.single("image"), uploadProfilePicture);
router.put("/upload/resume/:id", upload.single("resume"), uploadNewResume);
router.post("/save", saveEmployee);
router.get("/user/:id", getUser);
router.put("/update/:id", updateEmployee);
router.get("/users/me", getLoginUser);
router.get("/getdetails/:id", getProfileDetailsById);
router.post("/otpgenerate", sendOTP);

export  { router };
