import mongoose from "mongoose";
import handleMongooseError from "../helpers/isValidUser.js";

const Schema = mongoose.Schema;

export const emailRegexp = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
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
});

user.post("save", handleMongooseError);

const User = mongoose.model("user", user);

export default User;
