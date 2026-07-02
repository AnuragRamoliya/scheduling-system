import { Router } from "express";
import { availableDates, availableSlots, book, publicLink } from "../controllers/publicController";
import { publicRateLimiter } from "../middlewares/rateLimiter";
import { validate } from "../middlewares/validate";
import { availableSlotsSchema, createBookingSchema, publicTokenSchema } from "../validators/public";

export const publicRoutes = Router();

publicRoutes.use(publicRateLimiter);
publicRoutes.get("/:token", validate(publicTokenSchema), publicLink);
publicRoutes.get("/:token/available-dates", validate(publicTokenSchema), availableDates);
publicRoutes.get("/:token/slots", validate(availableSlotsSchema), availableSlots);
publicRoutes.post("/:token/book", validate(createBookingSchema), book);
