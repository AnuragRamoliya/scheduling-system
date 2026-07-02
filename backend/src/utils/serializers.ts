import { AvailabilitySlot } from "../models/AvailabilitySlot";
import { Booking } from "../models/Booking";
import { BookingLink } from "../models/BookingLink";

export const serializeAvailabilitySlot = (slot: AvailabilitySlot) => ({
  id: slot.id,
  user_id: slot.userId,
  date: slot.date,
  start_time: slot.startTime,
  end_time: slot.endTime,
  created_at: slot.createdAt,
  updated_at: slot.updatedAt
});

export const serializeBookingLink = (link: BookingLink) => ({
  id: link.id,
  user_id: link.userId,
  token: link.token,
  is_active: link.isActive,
  created_at: link.createdAt,
  updated_at: link.updatedAt
});

export const serializeBooking = (booking: Booking) => ({
  id: booking.id,
  booking_link_id: booking.bookingLinkId,
  date: booking.date,
  start_time: booking.startTime,
  end_time: booking.endTime,
  visitor_name: booking.visitorName,
  visitor_email: booking.visitorEmail,
  status: booking.status,
  created_at: booking.createdAt,
  updated_at: booking.updatedAt
});
