import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env";
import { availabilityRoutes } from "./routes/availabilityRoutes";
import { authRoutes } from "./routes/authRoutes";
import { bookingRoutes } from "./routes/bookingRoutes";
import { bookingLinkRoutes } from "./routes/bookingLinkRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/booking-links", bookingLinkRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/public", publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
