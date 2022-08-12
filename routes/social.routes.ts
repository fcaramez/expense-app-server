import IUserModel from "../custom";
import IPostModel from "../custom";
import { NextFunction, Response, Router, Request } from "express";
import { Model, Schema } from "mongoose";
const router: Router = require("express").Router();
const User: Model<IUserModel> = require("../models/User.model");
const Post: Model<IPostModel> = require("../models/Post.model");

router.get(
  "/users",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const allUsers = await User.find();

      res.status(200).json(allUsers);
    } catch (error) {
      res.status(404).json({ errorMessage: "Error getting users!" });
      next(error);
    }
  }
);

router.get(
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).populate(
        "posts followers following"
      );

      const { username, profilePicture, followers, following, posts } = user;

      res.status(200).json({
        username,
        profilePicture,
        followers,
        following,
        posts,
      });
    } catch (error) {
      res.status(404).json({ errorMessage: "Error getting the user" });
      next(error);
    }
  }
);

router.get(
  "/posts",
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const allPosts = await Post.find().populate("author");

      res.status(200).json(allPosts);
    } catch (error) {
      res.status(404).json({ errorMessage: "Error getting posts!" });
    }
  }
);

router.post("/posts", async (req: any, res: Response, _next: NextFunction) => {
  try {
    const { title, content, image, author } = req.body;

    const postCreated = await Post.create({
      title,
      content,
      image,
      author: author,
    });
    await User.findByIdAndUpdate(author, {
      $push: {
        posts: postCreated._id,
      },
    });
    res.status(201).json(postCreated);
  } catch (error) {
    res.status(302).json({ errorMessage: "Error creating post!" });
  }
});

router.put(
  "/post/:postId",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const { title, content, image, author } = req.body;

      const checkPost: any = await Post.findById(postId).populate("author");

      if (checkPost.author._id != author) {
        res.status(404).json({ errorMessage: "This is not your post!" });
        throw new Error("This is not your post!");
      }
      const editedPost = await Post.findByIdAndUpdate(postId, {
        title,
        content,
        image,
      });

      res.status(200).json(editedPost);
    } catch (error) {
      res.status(304).json({ errorMessage: "Error creating post!" });
      next(error);
    }
  }
);

router.delete(
  "/post/:postId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, userId } = req.params;
      const user = await User.findById(userId);

      if (!user.posts.includes(postId)) {
        res.status(400).json({ errorMessage: "This is not your post." });
        throw new Error("This is not your post");
      }

      const updatedUserArray: Array<Schema.Types.ObjectId> = user.posts.filter(
        (el) => {
          return el != postId;
        }
      );

      await User.findByIdAndUpdate(userId, {
        posts: updatedUserArray,
      });

      await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      next(error);
      return res.status(304).json({ errorMessage: "Error deleting Post" });
    }
  }
);

router.put(
  "/follow/:userInSession/:userToFollow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userInSession, userToFollow } = req.params;

      const checkCurrentUser = await User.findById(userInSession);

      if (checkCurrentUser.following.includes(userToFollow)) {
        res
          .status(404)
          .json({ errorMessage: "You are already following this user!" });
        throw new Error("You are already following this user!");
      } else {
        await User.findByIdAndUpdate(userInSession, {
          $push: {
            following: userToFollow,
          },
        });

        const followedUser = await User.findByIdAndUpdate(userToFollow, {
          $push: {
            followers: userInSession,
          },
        });

        res
          .status(204)
          .json({ message: `You are now following ${followedUser.username}` });
      }
    } catch (error) {
      res.status(304).json({ errorMessage: "Error following user!" });
      next(error);
    }
  }
);

router.put(
  "/unfollow/:userInSession/:userToUnfollow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userInSession, userToUnfollow } = req.params;

      const currentUser = await User.findById(userInSession);
      const unfollowedUser = await User.findById(userToUnfollow);

      if (currentUser.followers.includes(unfollowedUser)) {
        res
          .status(400)
          .json({ errorMessage: "You are not following this user!" });
        throw new Error("You are already following this user!");
      } else {
        const currentUserFollowing: Array<Schema.Types.ObjectId> =
          currentUser.following.filter((el) => {
            return el._id != userToUnfollow;
          });

        const unfollowUserArray: Array<Schema.Types.ObjectId> =
          unfollowedUser.followers.filter((el) => {
            return el._id != userInSession;
          });

        await User.findByIdAndUpdate(userInSession, {
          following: currentUserFollowing,
        });

        const unfollowedUserUpdated = await User.findByIdAndUpdate(
          userToUnfollow,
          {
            followers: unfollowUserArray,
          }
        );

        res.status(204).json({
          message: `You are no longer following ${unfollowedUserUpdated.username}`,
        });
      }
    } catch (error) {
      res.status(304).json({ errorMessage: "Error unfollowing user" });
      next(error);
    }
  }
);

module.exports = router;
