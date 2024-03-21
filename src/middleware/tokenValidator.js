import jwt from 'jsonwebtoken';
import {errorResponse} from '../utils/helpers.js'

const authenticateToken = (req, res, next) => {
  console.log(req.url , "req.url")
  if (
    req.url === "/api/employee/v1/login" ||
    req.url === "/api/employee/v1/signup" ||
    req.url.startsWith("/auth/google")
  ) {
    return next();
  }

  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return  errorResponse(res, 401, "Token is missing");
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (err) {
      return  errorResponse(res, 401, "Token is invalid");
    }
    res.header("Authorization", `Bearer ${token}`);
    next();
  } catch (err) {
    return  errorResponse(res, 401, "Something went wrong while validating token");
  }
};

export default authenticateToken;
