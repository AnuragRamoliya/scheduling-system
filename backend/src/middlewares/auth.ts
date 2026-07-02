import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models";
import { AppError } from "../utils/AppError";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication token is required");
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwt.secret) as { sub?: string };
    if (!payload.sub) {
      throw new AppError(401, "Invalid authentication token");
    }

    const user = await User.findByPk(payload.sub);
    if (!user) {
      throw new AppError(401, "Authenticated user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, "Invalid or expired authentication token"));
  }
};
