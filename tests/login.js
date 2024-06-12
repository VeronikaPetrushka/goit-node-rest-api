import { login } from "../controllers/auth.js";
import User from "../schemas/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("login controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with status 200 and return a token and user object", async () => {
    const user = {
      _id: "userId",
      email: "test@example.com",
      password: "hashedPassword",
      subscription: "starter",
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    const token = "jwtToken";
    jwt.sign.mockReturnValue(token);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  });

  it("should call next with an error if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      HttpError(401, "Email or password is wrong")
    );
  });

  it("should call next with an error if password is incorrect", async () => {
    const user = {
      _id: "userId",
      email: "test@example.com",
      password: "hashedPassword",
      subscription: "starter",
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      HttpError(401, "Email or password is wrong")
    );
  });

  it("should call next with an error if User.findByIdAndUpdate fails", async () => {
    const user = {
      _id: "userId",
      email: "test@example.com",
      password: "hashedPassword",
      subscription: "starter",
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("jwtToken");
    User.findByIdAndUpdate.mockRejectedValue(new Error("Update failed"));

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Update failed"));
  });
});
