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
const Expense = require("../models/Expense.model");
const User = require("../models/User.model");
router.get("/expenses/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let data = yield User.findById(userId);
        res.status(200).json(data.expenses);
    }
    catch (error) {
        return res
            .status(404)
            .json({ errorMessage: "Error retrieving your expenses!" });
    }
}));
router.post("/expenses/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { source, name, price, type, date } = req.body;
        const { userId } = req.params;
        if (source === "expense") {
            let createdExpense = yield Expense.create({
                source,
                name,
                price: price * -1,
                type,
                date,
            });
            let newUser = yield User.findByIdAndUpdate(userId, {
                $push: {
                    expenses: createdExpense,
                },
            }, { new: true }).populate("expenses");
            res.status(200).json(newUser.expenses);
        }
        else {
            let createdExpense = yield Expense.create({
                source,
                name,
                price,
                type,
                date,
            });
            let newUser = yield User.findByIdAndUpdate(userId, {
                $push: {
                    expenses: createdExpense,
                },
            }, { new: true }).populate("expenses");
            res.status(200).json(newUser.expenses);
        }
    }
    catch (error) {
        res.status(300).json({ errorMessage: "Error creating expense!" });
    }
}));
module.exports = router;
