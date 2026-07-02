import { Op } from "sequelize";
import { AvailabilitySlot } from "../models";
import { AppError } from "../utils/AppError";
import { normalizeTime } from "../utils/time";

export const createAvailabilitySlot = async (userId: string, input: { date: string; start_time: string; end_time: string }) => {
  const startTime = normalizeTime(input.start_time);
  const endTime = normalizeTime(input.end_time);

  const overlap = await AvailabilitySlot.findOne({
    where: {
      userId,
      date: input.date,
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: startTime }
    }
  });

  if (overlap) {
    throw new AppError(409, "This availability slot overlaps an existing slot");
  }

  return AvailabilitySlot.create({
    userId,
    date: input.date,
    startTime,
    endTime
  });
};

export const listAvailabilitySlots = async (userId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const result = await AvailabilitySlot.findAndCountAll({
    where: { userId },
    order: [
      ["date", "ASC"],
      ["startTime", "ASC"]
    ],
    limit,
    offset
  });

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: result.count,
      pages: Math.ceil(result.count / limit)
    }
  };
};

export const deleteAvailabilitySlot = async (userId: string, id: string) => {
  const deleted = await AvailabilitySlot.destroy({ where: { id, userId } });
  if (!deleted) {
    throw new AppError(404, "Availability slot not found");
  }
};
