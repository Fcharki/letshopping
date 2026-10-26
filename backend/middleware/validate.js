export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join("; "),
      });
    }

    req[source] = value;
    return next();
  };
};
