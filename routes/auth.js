import express from "express";
import { authShemas, registerSchema } from "../schemas/validation.js";
import { register, login } from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerSchema, register);

export default authRouter;
