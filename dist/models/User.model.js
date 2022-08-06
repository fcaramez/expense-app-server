"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        default: 0,
    },
    expenses: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Expense",
        },
    ],
});
const User = (0, mongoose_1.model)("User", userSchema);
module.exports = User;
