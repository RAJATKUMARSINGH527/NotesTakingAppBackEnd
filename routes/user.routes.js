const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { BlacklistedToken } = require("../models/blackListToken.model");
const { BlockedUser } = require("../models/blockedUser.model");


const userRouter = express.Router();


// routes/user.routes.js

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the user.
 *           example: "64af23a95c3e4b1b1e6c2e12"
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email of the user.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The hashed password of the user.
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user by providing their name, email, and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request or error in registration.
 */
userRouter.post("/", async (req, res) => {
  //logic
  try {
    const { name, email, password } = req.body;
    //environment variables always return string so we need to convert it to number
    bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
      async (err, hash) => {
        if (err) {
          res.json({ err });
        }
        const user = new UserModel({ name, email, password: hash });
        await user.save();
        res
          .status(201)
          .send({
            message: "You have been Successfully Registered!",
            user: user,
          });
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
});



/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user.
 *     description: Allows a user to log in by providing their email and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email or password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

// userRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Check if the email exists in the database
//     const matchingUser = await UserModel.findOne({ email });
//     if (matchingUser){
//       const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
//       if (isPasswordMatched) {
//         // If the password is correct, generate a token
//         const token = jwt.sign(
//           { userId: matchingUser._id ,user : matchingUser.name}, 
//           process.env.SECRET_KEY,
//           { expiresIn: "1h" } // Optional: Token expiration time
//         );
//         res
//           .status(200)
//           .json({ message: "You have been Successfully Logged in!", token });
//       }else{
//         res.status(400).json({ message: "Invalid email or password!" });
//       }
      
//     }else{
//       res.status(404).json({ message: "User not found!" });
//     }
//   } catch (err) {
//     // console.error("Error during login:", err); // Log the error for debugging
//     res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// });

userRouter.post("/login", async (req, res) => {
  console.log("Login request received:", req.body); // ✅ Log request data

  const { email, password } = req.body;
  try {
    const matchingUser = await UserModel.findOne({ email });

    if (!matchingUser) {
      console.log("User not found!");  // ✅ Log this
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
    if (!isPasswordMatched) {
      console.log("Invalid email or password!");  // ✅ Log this
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = jwt.sign(
      { userId: matchingUser._id, user: matchingUser.name },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Login successful! Token generated:", token);  // ✅ Log token
    return res.status(200).json({ message: "You have been Successfully Logged in!", token });

  } catch (err) {
    console.error("Error during login:", err);  // ✅ Log errors
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out the user by blacklisting their token.
 *     description: Adds the provided token to the blacklist to prevent future use.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer your_jwt_token_here"
 *         description: "JWT token to be blacklisted. Format: Bearer <token>"
 *     responses:
 *       200:
 *         description: User successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully!"
 *       400:
 *         description: Token not provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please send your token!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 *                 error:
 *                   type: string
 */

userRouter.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the secret key

  if (!token) {
    return res.status(400).json({ message: 'Please send your token!' });
  }

  try {
    // Save the token in the blacklist
    await BlacklistedToken.create({ token });
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!', error: error.message });
  }
});


/**
 * @swagger
 * /users/block:
 *   post:
 *     summary: Block a user by their ID.
 *     description: Adds the user's ID to the blocked list, preventing them from accessing certain resources.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to block.
 *                 example: "64af23a95c3e4b1b1e6c2e12"
 *     responses:
 *       200:
 *         description: User successfully blocked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with ID 64af23a95c3e4b1b1e6c2e12 is now blocked!"
 *       400:
 *         description: Missing or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 *                 error:
 *                   type: string
 */


userRouter.post('/block', async (req, res) => {
  const { userId } = req.body; // Get the naughty person’s ID

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required!' });
  }

  try {
    // Save the user ID in the blocked list
    await BlockedUser.create({ userId });
    res.status(200).json({ message: `User with ID ${userId} is now blocked!` });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!', error: error.message });
  }
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users.
 *     description: Fetch all registered users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find().populate("notes");
    res.status(200).json({ message: "The List of Users", users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve details of a single user.
 *     description: Fetch details of a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const users = await UserModel.find({ _id: id });
    res.status(200).json({ massage: "Details of a single user", users });
  } catch (error) {
    res.status(500).json({ massage: "Internal server error", error: error.message });
  }
});

module.exports = userRouter;
