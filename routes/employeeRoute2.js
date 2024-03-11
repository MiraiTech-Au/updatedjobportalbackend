const { signUp, login, updateEmployee, saveEmployee, uploadProfilePicture, getProfileDetailsById, getUser, getLoginUser, uploadNewResume  } = require("../controllers/employeeController2");
const express = require('express')
const multer = require("multer");

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


module.exports = router;