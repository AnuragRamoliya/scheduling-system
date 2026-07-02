import { Booking, BookingLink } from "../models";

export const listBookingsForUser = async (userId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const result = await Booking.findAndCountAll({
    include: [
      {
        model: BookingLink,
        as: "bookingLink",
        attributes: ["id", "token"],
        where: { userId }
      }
    ],
    where: { status: "confirmed" },
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
