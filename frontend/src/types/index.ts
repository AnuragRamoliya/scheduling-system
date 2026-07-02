export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: unknown;
};

export type User = {
  id: string;
  name: string;
  email: string;
  timezone: string;
};

export type AvailabilitySlot = {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
};

export type BookingLink = {
  id: string;
  user_id: string;
  token: string;
  is_active: boolean;
};

export type Booking = {
  id: string;
  booking_link_id: string;
  date: string;
  start_time: string;
  end_time: string;
  visitor_name: string;
  visitor_email: string;
  status: "confirmed" | "cancelled";
};

export type PublicLink = {
  token: string;
  host: {
    name?: string;
    timezone?: string;
  };
};

export type PublicSlot = {
  start_time: string;
  end_time: string;
};
