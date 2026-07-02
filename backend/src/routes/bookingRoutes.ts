import { Router } from "express";
import { listBookings } from "../controllers/bookingController";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { listBookingsSchema } from "../validators/booking";

export const bookingRoutes = Router();

bookingRoutes.use(requireAuth);
bookingRoutes.get("/", validate(listBookingsSchema), listBookings);
