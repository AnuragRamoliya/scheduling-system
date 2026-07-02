import rateLimit from "express-rate-limit";

export const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many public booking requests. Please try again later."
  }
});
