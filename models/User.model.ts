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
  profilePicture: {
    type: String,
    default:
      "https://imagens.brasil.elpais.com/resizer/-sq_qxO7YmGukKYkh1U6DCLYu78=/1200x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/LL3KKOVYQN5NFSMWTE4J3MD6ME.jpg",
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
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User: object = model<IUserModel>("User", userSchema);

module.exports = User;
