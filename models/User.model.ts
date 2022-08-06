import { model, ObjectId, Schema } from "mongoose";
import IUserModel from "../custom";

const userSchema: Schema = new Schema<IUserModel>({
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
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

const User: object = model<IUserModel>("User", userSchema);

module.exports = User;
