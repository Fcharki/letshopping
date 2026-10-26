export const notFound = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const responseStatus = res.statusCode !== 200 ? res.statusCode : null;
  let statusCode = err.statusCode || err.status || responseStatus || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path || "parameter"}`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(", ");
    message = fields ? `Duplicate value for: ${fields}` : "Duplicate key error";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};
