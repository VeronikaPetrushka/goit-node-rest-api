import { updateUserSubscriptionSchema } from "../schemas/validation.js";
import User from "../schemas/user.js";
import HttpError from "../middlewares/HttpError.js";
import Jimp from "jimp";
import fs from "fs/promises";

export const updateUserSubscription = async (req, res, next) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;

  const { error } = updateUserSubscriptionSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.details[0].message));
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return next(HttpError(404, "User not found"));
    }

    user.subscription = subscription;

    await user.save();

    res.status(200).json({
      message: "User subscription updated successfully",
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const { _id } = req.user;
    const tempPath = req.file.path;
    const filename = req.file.filename;
    const avatarDir = path.resolve("public", "avatars");
    const newPath = path.join(avatarDir, filename);

    await fs.mkdir(avatarDir, { recursive: true });

    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(newPath);

    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${filename}`;

    const user = await User.findByIdAndUpdate(
      _id,
      { avatarURL },
      { new: true }
    );

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
