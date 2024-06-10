import mongoose from "mongoose";
import handleMongooseError from "../helpers/mongooseErr.js";

const Schema = mongoose.Schema;

export const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

user.post("save", handleMongooseError);

const User = mongoose.model("user", user);

export default User;
