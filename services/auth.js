import User from "../schemas/user.js";

export const findUser = async (filter) => await User.findOne(filter);
export const deleteUsers = async (filter) => await User.deleteMany(filter);
export const updateUser = async (filter, data) =>
  await User.findOneAndUpdate(filter, data);
