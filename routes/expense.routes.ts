const router: Router = require("express").Router();
import { Request, Response, NextFunction, Router } from "express";
import { userInfo } from "os";
const Expense: any = require("../models/Expense.model");
const User: any = require("../models/User.model");

router.get(
  "/expenses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data = await Expense.find();

      res.status(200).json(data);
    } catch (error: any) {
      res.status(404).json({ errorMessage: "Error retrieving your expenses!" });
      next();
    }
  }
);

router.post(
  "/expenses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { source, name, price, type, date } = req.body;
      const { _id } = req.session.user;

      let createdExpense = await Expense.create({
        source,
        name,
        price,
        type,
        date,
      });

      await User.findByIdAndUpdate(_id, {
        $push: {
          expenses: createdExpense,
        },
      });

      res.status(200);
    } catch (error) {
      res.status(300).json({ errorMessage: "Error creating expense!" });
    }
  }
);

module.exports = router;
