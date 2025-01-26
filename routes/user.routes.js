const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

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
            massage: "You have been Successfully Registered!",
            user: user,
          });
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email exists in the database
    const matchingUser = await UserModel.findOne({ email });
    if (matchingUser){
      const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
      if (isPasswordMatched) {
        // If the password is correct, generate a token
        const token = jwt.sign(
          { userId: matchingUser._id ,user : matchingUser.name}, 
          process.env.SECRET_KEY,
          { expiresIn: "1h" } // Optional: Token expiration time
        );
        res
          .status(200)
          .json({ massage: "You have been Successfully Logged in!", token });
      }else{
        res.status(400).json({ massage: "Invalid email or password!" });
      }
      
    }else{
      res.status(404).json({ massage: "User not found!" });
    }
  } catch (err) {
    // console.error("Error during login:", err); // Log the error for debugging
    res.status(500).json({ massage: "Internal server error", error: err.massage });
  }
});


userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find().populate("notes");
    res.status(200).json({ massage: "The List of Users", users });
  } catch (error) {
    res.status(500).json({ massage: "Internal server error", error: error.message });
  }
});
module.exports = userRouter;
