import { Router } from "express";
import { generateLink, mine } from "../controllers/bookingLinkController";
import { requireAuth } from "../middlewares/auth";

export const bookingLinkRoutes = Router();

bookingLinkRoutes.use(requireAuth);
bookingLinkRoutes.post("/generate", generateLink);
bookingLinkRoutes.get("/mine", mine);
