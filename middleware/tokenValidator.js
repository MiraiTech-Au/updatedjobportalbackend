// middleware/tokenValidator.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    if (req.url === "/api/employee/v1/login" || req.url === "/api/employee/v1/signup" || req.url.startsWith("/auth/google") ) {
        return next();
    }
    
    try
    {
        const token = req?.headers?.authorization?.split(' ')[1];
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }
        try 
        {
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            
            req.user = decode
        }
        catch(err)
        {
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        res.header('Authorization', `Bearer ${token}`);
        next();
    }
    catch(err)
    {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating token"
        })
    }
};

module.exports = authenticateToken;
