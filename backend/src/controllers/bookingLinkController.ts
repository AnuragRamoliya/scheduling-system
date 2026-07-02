import { RequestHandler } from "express";
import { generateBookingLink, getMyBookingLink } from "../services/bookingLinkService";
import { serializeBookingLink } from "../utils/serializers";

export const generateLink: RequestHandler = async (req, res, next) => {
  try {
    const link = await generateBookingLink(req.user!.id);
    res.status(201).json({ success: true, data: serializeBookingLink(link) });
  } catch (error) {
    next(error);
  }
};

export const mine: RequestHandler = async (req, res, next) => {
  try {
    const link = await getMyBookingLink(req.user!.id);
    res.json({ success: true, data: link ? serializeBookingLink(link) : null });
  } catch (error) {
    next(error);
  }
};
