export const findUser = (filter) => User.findOne(filter);
export const deleteUsers = (filter) => User.deleteMany(filter);
export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
