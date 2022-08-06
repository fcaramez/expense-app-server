"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const mongoose = require("mongoose");
const saltRounds = 10;
router.get("/verify", isAuthenticated, (req, res, next) => {
    try {
        res.status(200).json(req.payload);
    }
    catch (error) {
        res.status(404).json({ errorMessage: "Error authenticating" });
    }
});
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        if (!regex.test(password)) {
            return res.status(400).json({
                errorMessage: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
            });
        }
        const repeatEmail = yield User.findOne({ email });
        if (repeatEmail) {
            return res.status(400).json({ errorMessage: "Email already taken!" });
        }
        const repeatUsername = yield User.findOne({ username });
        if (repeatUsername) {
            return res
                .status(400)
                .json({ errorMessage: "Username already taken!" });
        }
        const salt = yield bcrypt.genSalt(saltRounds);
        const hashedPassword = yield bcrypt.hash(password, salt);
        let user = yield User.create({
            username,
            email,
            password: hashedPassword,
            budget,
            expenses,
        });
        req.session.user = user;
        return res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                errorMessage: "Email need to be unique. The email you chose is already in use.",
            });
        }
        return res.status(500).json({ errorMessage: error.message });
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userFound = yield User.findOne({ email });
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
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "24h",
        });
        return res.status(200).json({ authToken });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/profile/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let user = yield User.findById(userId).populate("expenses");
        res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json({ errorMessage: "Error retrieving user" });
    }
}));
module.exports = router;
