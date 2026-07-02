import { ErrorRequestHandler, RequestHandler } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten()
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: "A conflicting record already exists"
    });
  }

  if (err instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      message: "Database validation failed",
      errors: err.errors.map((item) => item.message)
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
