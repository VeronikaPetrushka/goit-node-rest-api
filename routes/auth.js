import express from "express";
import { registerValid, loginValid } from "../middlewares/isValidUser.js";
import { register, login, getCurrent, logout } from "../controllers/auth.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", registerValid, register);
authRouter.post("/login", loginValid, login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
