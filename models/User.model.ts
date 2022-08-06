import { model, Schema } from "mongoose";

interface IUserModel {
  username?: string | object;
  email: string | object;
  password: string | object;
  expenses: Array<any>;
}

const userSchema: Schema = new Schema<IUserModel>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    match:
      "/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:. [a-zA-Z0-9-]+)*$/",
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
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
