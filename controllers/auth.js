import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import "dotenv/config";
import crypto from "node:crypto";
import User from "../schemas/user.js";
import HttpError from "../middlewares/HttpError.js";
import { JWT_EXPIRATION, JWT_SECRET } from "../jwt.js";
import mail from "../mail.js";
import { findUser, updateUser } from "../services/auth.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: "veronikapetrushka@gmail.com",
      subject: "Welcome to ContactBook",
      html: `To confirm your email please click on <a href="http:/localhost:8080/api/users/verify/:${verificationToken}" target="_blank">link</a>`,
      text: `To confirm your email please open the link http:/localhost:8080/api/users/verify/:${verificationToken}`,
    });

    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      verificationToken,
      avatarURL,
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

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await findUser({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await updateUser(
      { _id: user._id },
      { verify: true, verificationToken: "" }
    );

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="http://localhost:8080/api/users/verify/:${user.verificationToken}" target="_blank">Click to verify</a>`,
  };

  await mail.sendMail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Please verify your email");
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
