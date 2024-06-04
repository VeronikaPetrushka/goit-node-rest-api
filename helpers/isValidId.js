import isValidObjectId from "mongoose";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({
      message: `${id} is not valid id`,
    });
  }
  next();
};

export default isValidId;
