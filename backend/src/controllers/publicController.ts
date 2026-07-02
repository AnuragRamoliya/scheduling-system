import { RequestHandler } from "express";
import {
  createPublicBooking,
  getActiveBookingLink,
  getAvailableDates,
  getAvailableSlots
} from "../services/publicBookingService";
import { serializeBooking } from "../utils/serializers";

export const publicLink: RequestHandler = async (req, res, next) => {
  try {
    const link = await getActiveBookingLink(req.params.token);
    const host = link.get("user") as { name?: string; timezone?: string } | undefined;
    res.json({
      success: true,
      data: {
        token: link.token,
        host: {
          name: host?.name,
          timezone: host?.timezone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const availableDates: RequestHandler = async (req, res, next) => {
  try {
    const dates = await getAvailableDates(req.params.token);
    res.json({ success: true, data: dates });
  } catch (error) {
    next(error);
  }
};

export const availableSlots: RequestHandler = async (req, res, next) => {
  try {
    const slots = await getAvailableSlots(req.params.token, String(req.query.date));
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};

export const book: RequestHandler = async (req, res, next) => {
  try {
    const booking = await createPublicBooking(req.params.token, req.body);
    res.status(201).json({ success: true, data: serializeBooking(booking) });
  } catch (error) {
    next(error);
  }
};
