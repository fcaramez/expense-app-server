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
      "https://imagens.brasil.elpais.com/resizer/-sq_qxO7YmGukKYkh1U6DCLYu78=/1200x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/LL3KKOVYQN5NFSMWTE4J3MD6ME.jpg",
  },
});

const Post: object = model<IPostModel>("Post", postSchema);

module.exports = Post;
