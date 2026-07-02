import { Op, UniqueConstraintError } from "sequelize";
import { env } from "../config/env";
import { AvailabilitySlot, Booking, BookingLink, sequelize, User } from "../models";
import type { BookingLink as BookingLinkModel } from "../models/BookingLink";
import { AppError } from "../utils/AppError";
import { minutesFromTime, normalizeTime, rangesOverlap, timeFromMinutes } from "../utils/time";

export const getActiveBookingLink = async (token: string) => {
  const link = await BookingLink.findOne({
    where: { token, isActive: true },
    include: [{ model: User, as: "user", attributes: ["id", "name", "email", "timezone"] }]
  });

  if (!link) {
    throw new AppError(404, "Booking link not found or inactive");
  }

  return link;
};

export const getAvailableDates = async (token: string) => {
  const link = await getActiveBookingLink(token);
  const today = new Date().toISOString().slice(0, 10);
  const slots = await AvailabilitySlot.findAll({
    where: {
      userId: link.userId,
      date: { [Op.gte]: today }
    },
    attributes: ["date"],
    group: ["date"],
    order: [["date", "ASC"]]
  });

  return slots.map((slot) => slot.date);
};

const getBookableSlots = async (link: BookingLinkModel, date: string) => {
  const availability = await AvailabilitySlot.findAll({
    where: { userId: link.userId, date },
    order: [["startTime", "ASC"]]
  });

  const bookings = await Booking.findAll({
    where: {
      bookingLinkId: link.id,
      date,
      status: "confirmed"
    }
  });

  const intervals: Array<{ start_time: string; end_time: string }> = [];
  for (const window of availability) {
    for (
      let cursor = minutesFromTime(window.startTime);
      cursor + env.slotIntervalMinutes <= minutesFromTime(window.endTime);
      cursor += env.slotIntervalMinutes
    ) {
      const start = timeFromMinutes(cursor);
      const end = timeFromMinutes(cursor + env.slotIntervalMinutes);
      const taken = bookings.some((booking) => rangesOverlap(start, end, booking.startTime, booking.endTime));
      if (!taken) {
        intervals.push({ start_time: start, end_time: end });
      }
    }
  }

  return intervals;
};

export const getAvailableSlots = async (token: string, date: string) => {
  const link = await getActiveBookingLink(token);
  return getBookableSlots(link, date);
};

export const createPublicBooking = async (
  token: string,
  input: {
    date: string;
    start_time: string;
    end_time: string;
    visitor_name: string;
    visitor_email: string;
  }
) => {
  const link = await getActiveBookingLink(token);
  const startTime = normalizeTime(input.start_time);
  const endTime = normalizeTime(input.end_time);

  try {
    return await sequelize.transaction(async (transaction) => {
      const availability = await AvailabilitySlot.findOne({
        where: {
          userId: link.userId,
          date: input.date,
          startTime: { [Op.lte]: startTime },
          endTime: { [Op.gte]: endTime }
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!availability) {
        throw new AppError(422, "Requested slot is outside the host's availability");
      }

      const existing = await Booking.findOne({
        where: {
          bookingLinkId: link.id,
          date: input.date,
          status: "confirmed",
          startTime: { [Op.lt]: endTime },
          endTime: { [Op.gt]: startTime }
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (existing) {
        throw new AppError(409, "This slot was just taken. Please choose another time.");
      }

      return Booking.create(
        {
          bookingLinkId: link.id,
          date: input.date,
          startTime,
          endTime,
          visitorName: input.visitor_name,
          visitorEmail: input.visitor_email,
          status: "confirmed"
        },
        { transaction }
      );
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(409, "This slot was just taken. Please choose another time.");
    }
    throw error;
  }
};
