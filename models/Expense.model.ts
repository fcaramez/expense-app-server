import { model, Schema } from "mongoose";

interface IExpenseModel {}

const expenseSchema: Schema = new Schema<IExpenseModel>({
  expenseType: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Expense: object = model<IExpenseModel>("Expense", expenseSchema);

module.exports = Expense;
