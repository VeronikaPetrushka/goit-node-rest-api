import HttpError from "./HttpError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../jwt.js";
import User from "../schemas/user.js";

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    return next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
