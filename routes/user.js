import express from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  updateUserSubscription,
  updateUserAvatar,
} from "../controllers/user.js";
import upload from "../middlewares/avatar.js";

const userRouter = express.Router();

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);
userRouter.patch("/", authenticate, updateUserSubscription);

export default userRouter;
