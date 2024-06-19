import mongoose from "mongoose";
import handleMongooseError from "../middlewares/mongooseErr.js";

const Schema = mongoose.Schema;

export const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const user = new Schema({
  password: {
    type: String,
    minlength: 6,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: emailRegexp,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
    required: [true, "Verify token is required"],
  },
});

user.post("save", handleMongooseError);

const User = mongoose.model("user", user);

export default User;
