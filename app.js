import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import "dotenv/config";

import contactsRouter from "./routes/contacts.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import handleMongooseError from "./middlewares/mongooseErr.js";

import "./db.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// app.use(express.static("public"));

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api/users", authRouter);
app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.use(handleMongooseError);

const PORT = process.env.PORT || 8080;

try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error(`Server not running. Error message: ${err.message}`);
}
