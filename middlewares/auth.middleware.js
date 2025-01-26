const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = async(req, res, next) => {
    try {
        //optional chaining for null check if headers.Authorization is not present then it will return undefined
        const token = req.headers.authorization?.split(" ")[1]; 
        if(!token) {
            res.status(400).send({error: 'Please authenticate'});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        console.log(decoded);
        
        req.body.user = decoded.user;
        req.body.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(500).send({error:"Internal server error",error:error.message});
    }
}

module.exports={authMiddleware};