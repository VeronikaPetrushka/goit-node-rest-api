import mongoose from "mongoose";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: `${id} is not a valid id`,
    });
  }
  next();
};

export default isValidId;
