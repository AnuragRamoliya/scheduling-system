import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";

export const publicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  timezone: user.timezone
});

export const signAccessToken = (user: User) => {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"] };
  return jwt.sign({ sub: user.id, email: user.email }, env.jwt.secret, options);
};

export const createUrlSafeToken = () => crypto.randomBytes(24).toString("base64url");
