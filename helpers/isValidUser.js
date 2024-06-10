function handleMongooseError(err, req, res, next) {
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(err.errors).map(
      (error) => error.message
    );
    return res.status(400).json({ errors: errorMessages });
  }
  next(err);
}

export default handleMongooseError;
