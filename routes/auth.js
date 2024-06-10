import express from "express";
import { registerValid, loginValid } from "../helpers/isValidUser.js";
import { register, login } from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerValid, register);
authRouter.post("/login", loginValid, login);

export default authRouter;
