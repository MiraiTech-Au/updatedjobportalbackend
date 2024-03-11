const express = require('express');
const passport = require('../utils/passport');
const { loginwithgoogle, logoutwithgoogle } = require('../controllers/authController');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require("../models/employeeModal2");

const baseurl = process.env.BASE_URL

// Define your auth routes here
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get("/auth/google/callback", passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/profile",
//     failureRedirect: "http://localhost:3000/login"
// }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${baseurl}/login` }), async(req, res) => {
  const token = req.user.token;
  if (!token) {
    return res.redirect(`${baseurl}/login`);

    
  }
  
  
   
  res.redirect(`${baseurl}/login?token=${token}`)
  
    // res.status(200).json({message:"google login successfully", emp,token });
  });

//google login check 
router.get("/login/sucess",async(req,res)=>{
    try
    {
        if(req.user){
            res.status(200).json({message:"user google Login",user:req.user})
        }else{
            res.status(400).json({message:"Not Authorized"})
        }
    }
    catch(err)
     {
            res.status(500).json({ message: err.message });
    }
}
)

router.get("/logout", logoutwithgoogle)

//linkedin routes

// router.get('/auth/linkedin', passport.authenticate('linkedin'));

// LinkedIn Callback URL
// router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
//     successRedirect: '/profile',
//     failureRedirect: '/login'
// }));

module.exports = router;
