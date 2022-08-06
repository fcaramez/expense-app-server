import { model, Schema } from "mongoose";
import IExpenseModel from "../custom";

const expenseSchema: Schema = new Schema<IExpenseModel>({
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

const Expense: object = model<IExpenseModel>("Expense", expenseSchema);

module.exports = Expense;
