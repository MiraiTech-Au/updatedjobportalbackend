import express from 'express';
import passport from '../utils/passport.js';
import { logoutwithgoogle } from '../controllers/authController/authController.js';

const router = express.Router();


const baseurl = process.env.BASE_URL

// Define your auth routes here
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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

export default router;
