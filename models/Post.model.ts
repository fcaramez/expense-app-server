import { model, Schema } from "mongoose";
import IPostModel from "../custom";

const postSchema: Schema = new Schema<IPostModel>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/fcaramez/image/upload/v1660294578/expense-app/Nicolas_Cage_hdp7sn.webp",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Post: object = model<IPostModel>("Post", postSchema);

module.exports = Post;
