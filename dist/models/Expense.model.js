"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const expenseSchema = new mongoose_1.Schema({
    source: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: [
            "Household",
            "Technology",
            "Work",
            "Salary",
            "Allowance",
            "Transportation",
            "Entertainment",
            "Going Out",
            "Other",
        ],
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});
const Expense = (0, mongoose_1.model)("Expense", expenseSchema);
module.exports = Expense;
