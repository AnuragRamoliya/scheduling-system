import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { User } from "../models";
import { AppError } from "../utils/AppError";
import { publicUser, signAccessToken } from "../utils/tokens";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing) {
      throw new AppError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      timezone: req.body.timezone
    });

    res.status(201).json({
      success: true,
      data: {
        user: publicUser(user),
        token: signAccessToken(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const matches = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!matches) {
      throw new AppError(401, "Invalid email or password");
    }

    res.json({
      success: true,
      data: {
        user: publicUser(user),
        token: signAccessToken(user)
      }
    });
  } catch (error) {
    next(error);
  }
};
