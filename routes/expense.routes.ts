const router: any = require("express").Router();
import { Request, Response, NextFunction, Router } from "express";
const Expense: any = require("../models/Expense.model");
const User: any = require("../models/User.model");

router.get(
  "/expenses/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      let data = await User.findById(userId);

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
              expenses: createdExpense,
            },
          },
          { new: true }
        ).populate("expenses");

        res.status(200).json(newUser.expenses);
      } else {
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
              expenses: createdExpense,
            },
          },
          { new: true }
        ).populate("expenses");

        res.status(200).json(newUser.expenses);
      }
    } catch (error) {
      res.status(300).json({ errorMessage: "Error creating expense!" });
    }
  }
);

module.exports = router;
