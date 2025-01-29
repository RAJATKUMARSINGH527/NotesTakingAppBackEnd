const jwt = require('jsonwebtoken');
require('dotenv').config();
const {BlockedUser} = require('../models/blockedUser.model');

const verifyToken  = async(req, res, next) => {
    try {
        //optional chaining for null check if headers.Authorization is not present then it will return undefined
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(" ")[1]; 
        if(!token) {
            res.status(400).send({error: '"Unauthorized access! Token missing."'});
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        console.log(decoded);

         // Attach decoded user info to the request
        req.body.user = decoded.user;
        req.body.userId = decoded.userId;

        // Pass control to the next middleware
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token!", error: error.message });
    }
};

// Middleware to check if the user is blocked
const isUserBlocked = async (req, res, next) => {
    try {
      const blockedUser = await BlockedUser.findOne({ userId: req.body.userId }); // Check if user is blocked
      if (blockedUser) {
        return res.status(403).json({ message: "You are blocked!" });
      }
      next(); // Pass control to the next middleware
    } catch (error) {
      res.status(500).json({ message: "Internal server error!", error: error.message });
    }
  };
  

module.exports={verifyToken,isUserBlocked};