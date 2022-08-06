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
        let user = yield User.findById(userId);
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
                    expenses: createdExpense._id,
                },
                budget: user.budget + createdExpense.price,
            }, { new: true }).populate("expenses");
            return res.status(200).json(newUser.expenses);
        }
        if (source === "income") {
            let createdExpense = yield Expense.create({
                source,
                name,
                price,
                type,
                date,
            });
            let newUser = yield User.findByIdAndUpdate(userId, {
                $push: {
                    expenses: createdExpense._id,
                },
                budget: user.budget + createdExpense.price,
            }, { new: true }).populate("expenses");
            return res.status(200).json(newUser.expenses);
        }
    }
    catch (error) {
        res.status(300).json({ errorMessage: "Error creating expense!" });
    }
}));
router.delete("/expense/:expenseId/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expenseId, userId } = req.params;
        let deletedExpense = yield Expense.findByIdAndRemove(expenseId);
        let user = yield User.findById(userId).populate("expenses");
        yield User.findByIdAndUpdate(userId, {
            $pull: {
                expenses: expenseId,
            },
            budget: user.budget - deletedExpense.price,
        });
        res.status(200).json({ message: "Expense deleted successfully" });
    }
    catch (error) {
        return res.status(200).json({ errorMessage: "Error deleting expense" });
    }
}));
module.exports = router;