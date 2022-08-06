const router: any = require("express").Router();
import { Request, Response, NextFunction, Router } from "express";
import { Mongoose } from "mongoose";
const User: any = require("../models/User.model");
const bcrypt: any = require("bcryptjs");
const jwt: any = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const mongoose: Mongoose = require("mongoose");

const saltRounds: Number = 10;

router.get(
  "/verify",
  isAuthenticated,
  (req: any, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(req.payload);
    } catch (error) {
      res.status(404).json({ errorMessage: "Error authenticating" });
    }
  }
);

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, budget, expenses } = req.body;

      if (!username) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide your username!" });
      }
      if (!email) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide your email!" });
      }
      if (!password) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide your password!" });
      }

      if (password.length < 8) {
        return res.status(400).json({
          errorMessage: "Your password needs to be 8 characters long.",
        });
      }

      const regex: RegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

      if (!regex.test(password)) {
        return res.status(400).json({
          errorMessage:
            "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
        });
      }

      const repeatEmail = await User.findOne({ email });

      if (repeatEmail) {
        return res.status(400).json({ errorMessage: "Email already taken!" });
      }

      const repeatUsername = await User.findOne({ username });

      if (repeatUsername) {
        return res
          .status(400)
          .json({ errorMessage: "Username already taken!" });
      }

      const salt = await bcrypt.genSalt(saltRounds);

      const hashedPassword: string = await bcrypt.hash(password, salt);

      let user = await User.create({
        username,
        email,
        password: hashedPassword,
        budget,
        expenses,
      });

      req.session.user = user;
      return res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage:
            "Email need to be unique. The email you chose is already in use.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide your email" });
      }

      if (!password) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide your password" });
      }

      const userFound = await User.findOne({ email });

      if (!userFound) {
        return res
          .status(400)
          .json({ errorMessage: "No user matches the provided email." });
      }

      const comparePassword = bcrypt.compare(password, userFound.password);

      if (!comparePassword) {
        return res.status(400).json({ errorMessage: "Wrong password" });
      }

      const payload = {
        _id: userFound._id,
        username: userFound.username,
        email: userFound.email,
      };

      const authToken: any = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "24h",
      });

      return res.status(200).json({ authToken });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  "/profile/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      let user = await User.findById(userId).populate("expenses");

      res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ errorMessage: "Error retrieving user" });
    }
  }
);

module.exports = router;
