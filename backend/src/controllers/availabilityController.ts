import { RequestHandler } from "express";
import {
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  listAvailabilitySlots
} from "../services/availabilityService";
import { serializeAvailabilitySlot } from "../utils/serializers";

export const createAvailability: RequestHandler = async (req, res, next) => {
  try {
    const slot = await createAvailabilitySlot(req.user!.id, req.body);
    res.status(201).json({ success: true, data: serializeAvailabilitySlot(slot) });
  } catch (error) {
    next(error);
  }
};

export const listAvailability: RequestHandler = async (req, res, next) => {
  try {
    const result = await listAvailabilitySlots(req.user!.id, Number(req.query.page), Number(req.query.limit));
    res.json({
      success: true,
      data: result.data.map(serializeAvailabilitySlot),
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const removeAvailability: RequestHandler = async (req, res, next) => {
  try {
    await deleteAvailabilitySlot(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
