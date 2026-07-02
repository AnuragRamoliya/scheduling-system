import { Router } from "express";
import {
  createAvailability,
  listAvailability,
  removeAvailability
} from "../controllers/availabilityController";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createAvailabilitySchema,
  deleteAvailabilitySchema,
  listAvailabilitySchema
} from "../validators/availability";

export const availabilityRoutes = Router();

availabilityRoutes.use(requireAuth);
availabilityRoutes.post("/", validate(createAvailabilitySchema), createAvailability);
availabilityRoutes.get("/", validate(listAvailabilitySchema), listAvailability);
availabilityRoutes.delete("/:id", validate(deleteAvailabilitySchema), removeAvailability);
