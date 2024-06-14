import User from "../schemas/user.js";
import HttpError from "../middlewares/HttpError.js";
import bcrypt from "bcrypt";
import { JWT_EXPIRATION, JWT_SECRET } from "../jwt.js";
import jwt from "jsonwebtoken";
import { updateUserSubscriptionSchema } from "../schemas/validation.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    if (newUser) {
      return res.status(200).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    await User.findByIdAndUpdate(user._id, { token });

    if (isPasswordValid) {
      return res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else {
      return res.status(400).json({ message: "Failed to login" });
    }
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
};

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
