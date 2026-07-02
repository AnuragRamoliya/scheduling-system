import { BookingLink } from "../models";
import { createUrlSafeToken } from "../utils/tokens";

export const generateBookingLink = async (userId: string) => {
  const existing = await BookingLink.findOne({ where: { userId, isActive: true } });
  if (existing) {
    return existing;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await BookingLink.create({
        userId,
        token: createUrlSafeToken(),
        isActive: true
      });
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
    }
  }

  throw new Error("Unable to create booking link");
};

export const getMyBookingLink = async (userId: string) =>
  BookingLink.findOne({ where: { userId, isActive: true }, order: [["createdAt", "DESC"]] });
