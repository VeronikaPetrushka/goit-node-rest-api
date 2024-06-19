import express from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  updateUserSubscription,
  updateUserAvatar,
} from "../controllers/user.js";
import upload from "../middlewares/avatar.js";
import { resendVerify, verifyEmail } from "../controllers/auth.js";
import { validateUserEmail } from "../middlewares/isValidUser.js";

const userRouter = express.Router();

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);
userRouter.patch("/", authenticate, updateUserSubscription);
userRouter.get("/verify/:verificationToken", verifyEmail);
userRouter.post("/verify", validateUserEmail, resendVerify);

export default userRouter;
