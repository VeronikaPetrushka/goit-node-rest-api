import { authShemas, registerSchema } from "../schemas/validation.js";
import User from "../schemas/user.js";

export const register = async (req, res) => {
  const newUser = await User.create(req.body);

  if (newUser) {
    return res.status(200).json({
      email: newUser.email,
      name: newUser.name,
    });
  } else {
    return res.status(400).json({ message: "Failed to create user" });
  }
};

export const login = async (req, res) => {};
