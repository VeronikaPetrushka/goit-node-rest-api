import express from "express";

const authRouter = express.Router();

authRouter.post("/register");

module.exports = authRouter;