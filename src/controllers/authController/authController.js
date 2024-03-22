export const  loginwithgoogle = async(req,res)=>{
    try
    {
        if(req.user){
            res.status(200).json({message:"user Login",user:req.user})
        }else{
            res.status(400).json({message:"Not Authorized"})
        }
    }
    catch(err)
     {
            res.status(500).json({ message: err.message });
    }
}

export const logoutwithgoogle = (req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3001");
    })
}