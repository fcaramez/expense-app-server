import IUserModel from "../custom";
import IPostModel from "../custom";
import { NextFunction, Response, Router, Request } from "express";
import { Model } from "mongoose";
const router: Router = require("express").Router();
const User: Model<IUserModel> = require("../models/User.model");
const Post: Model<IPostModel> = require("../models/Post.model");

router.get(
  "/posts",
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const allPosts = await Post.find().populate("author");

      res.status(200).json(allPosts);
    } catch (error) {
      res.status(302).json({ errorMessage: "Error getting posts!" });
    }
  }
);

router.post("/posts", async (req: any, res: Response, _next: NextFunction) => {
  try {
    const { title, content, image, author } = req.body;

    const postCreated = await Post.create({ title, content, image, author });
    await User.findByIdAndUpdate(author, {
      $push: {
        posts: postCreated._id,
      },
    });
    res.status(200).json(postCreated);
  } catch (error) {
    res.status(302).json({ errorMessage: "Error creating post!" });
  }
});

router.put(
  "/post/:postId",
  async (req: any, res: Response, _next: NextFunction) => {
    try {
      const { postId } = req.params;
      const { title, content, image, author } = req.body;

      const editedPost = await Post.findByIdAndUpdate(postId, {
        title,
        content,
        image,
        author,
      });

      res.status(200).json(editedPost);
    } catch (error) {
      res.status(302).json({ errorMessage: "Error creating post!" });
    }
  }
);

router.delete(
  "/post/:postId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, userId } = req.params;
      const user = await User.findById(userId);

      const updatedUserArray = user.posts.unshift(postId);

      await User.findByIdAndUpdate(userId, {
        posts: updatedUserArray,
      });

      await Post.findByIdAndDelete(postId);
    } catch (error) {
      next(error);
      return res.status(302).json({ errorMessage: "Error deleting Post" });
    }
  }
);

module.exports = router;
