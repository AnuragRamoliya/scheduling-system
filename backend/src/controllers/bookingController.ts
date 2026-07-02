import { RequestHandler } from "express";
import { listBookingsForUser } from "../services/bookingService";
import { serializeBooking } from "../utils/serializers";

export const listBookings: RequestHandler = async (req, res, next) => {
  try {
    const result = await listBookingsForUser(req.user!.id, Number(req.query.page), Number(req.query.limit));
    res.json({
      success: true,
      data: result.data.map(serializeBooking),
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};
