import IUserModel from "../custom";
import IExpenseModel from "../custom";
import { Model } from "mongoose";
const router: any = require("express").Router();
import { Request, Response, NextFunction, Router } from "express";
const Expense: Model<IExpenseModel> = require("../models/Expense.model");
const User: Model<IUserModel> = require("../models/User.model");

router.get(
  "/expenses/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      let data = await User.findById(userId).populate("expenses");

      res.status(200).json(data.expenses);
    } catch (error: any) {
      return res
        .status(404)
        .json({ errorMessage: "Error retrieving your expenses!" });
    }
  }
);

router.post(
  "/expenses/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { source, name, price, type, date } = req.body;
      const { userId } = req.params;

      let user = await User.findById(userId);

      if (source === "expense") {
        let createdExpense = await Expense.create({
          source,
          name,
          price: price * -1,
          type,
          date,
        });

        let newUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              expenses: createdExpense._id,
            },
            budget: user.budget + createdExpense.price,
          },
          { new: true }
        ).populate("expenses");

        return res.status(200).json(newUser.expenses);
      }
      if (source === "income") {
        let createdExpense = await Expense.create({
          source,
          name,
          price,
          type,
          date,
        });

        let newUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              expenses: createdExpense._id,
            },
            budget: user.budget + createdExpense.price,
          },
          { new: true }
        ).populate("expenses");

        return res.status(200).json(newUser.expenses);
      }
    } catch (error) {
      res.status(300).json({ errorMessage: "Error creating expense!" });
    }
  }
);

router.put(
  "/expense/:expenseId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { expenseId, userId } = req.params;
      const { source, name, price, type, date } = req.body;

      if (source === "expense") {
        await Expense.findByIdAndUpdate(
          expenseId,
          {
            source,
            name,
            price: price * -1,
            type,
            date,
          },
          { new: true }
        );
        let user = await User.findById(userId).populate("expenses");

        let sum: Number = 0;
        user.expenses.map((el: any) => {
          return (sum += el.price);
        });

        await User.findByIdAndUpdate(userId, {
          budget: sum,
        });

        return res
          .status(200)
          .json({ message: "Expense updated Successfully!" });
      }
      if (source === "income") {
        let user = await User.findById(userId).populate("expenses");

        let oldPrice = await Expense.findByIdAndUpdate(expenseId, {
          source,
          name,
          price,
          type,
          date,
        });

        await User.findByIdAndUpdate(
          user._id,
          {
            budget: user.budget - oldPrice.price + price,
          },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "Expense updated Successfully!" });
      }
    } catch (error) {
      return res.status(300).json({ errorMessage: "Error updating expense" });
    }
  }
);

router.delete(
  "/expense/:expenseId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { expenseId, userId } = req.params;
      let deletedExpense = await Expense.findByIdAndRemove(expenseId);
      let user = await User.findById(userId).populate("expenses");

      await User.findByIdAndUpdate(userId, {
        budget: user.budget - deletedExpense.price,
      });

      await User.deleteMany({ expenses: expenseId });

      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      return res.status(200).json({ errorMessage: "Error deleting expense" });
    }
  }
);

module.exports = router;
