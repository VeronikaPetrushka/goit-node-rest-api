import { authShemas, registerSchema } from "../schemas/validation.js";
import User from "../schemas/user.js";

export const register = async (req, res) => {
  const newUser = await User.create(req.body);

  res.json({
    email: newUser.email,
    name: newUser.name,
  });
};

export const login = async (req, res) => {};
