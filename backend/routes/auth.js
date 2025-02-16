import express from 'express';  // Use ES module import
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route: POST
router.post(
  "/signup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name with at least 3 characters").isLength({ min: 3 }),
    body("password", "Password must be at least 8 characters long").isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 status and error details
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      const { email, name, password } = req.body;

      // Check if user already exists with the provided email
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success, error: "Email already exists!" });
      }

      // Hash the password and create the new user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save the new user to the database
      await user.save();

      // Create the payload for JWT token
      const data = {
        user: {
          id: user._id,
        },
      };

      // Generate a JWT token
      const authToken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({
        authToken,
        success,
        name: user.name,
        id: user._id,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Login route: POST
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials!",
        });
      } else {
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res.status(400).json({
            success,
            error: "Please try to login with correct credentials!",
          });
        }

        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({
          authToken,
          success,
          name: user.name,
          id: user.id,
        });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;  // Use export default to enable ES module export
