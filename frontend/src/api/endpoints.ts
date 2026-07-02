import { api } from "./client";
import type { ApiResponse, AvailabilitySlot, Booking, BookingLink, PublicLink, PublicSlot, User } from "../types";

export const authApi = {
  register: async (payload: { name: string; email: string; password: string; timezone: string }) => {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/register", payload);
    return data.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", payload);
    return data.data;
  }
};

export const availabilityApi = {
  create: async (payload: { date: string; start_time: string; end_time: string }) => {
    const { data } = await api.post<ApiResponse<AvailabilitySlot>>("/availability", payload);
    return data.data;
  }
};

export const bookingLinkApi = {
  generate: async () => {
    const { data } = await api.post<ApiResponse<BookingLink>>("/booking-links/generate");
    return data.data;
  },
  mine: async () => {
    const { data } = await api.get<ApiResponse<BookingLink | null>>("/booking-links/mine");
    return data.data;
  }
};

export const bookingApi = {
  list: async () => {
    const { data } = await api.get<ApiResponse<Booking[]>>("/bookings", { params: { page: 1, limit: 50 } });
    return data.data;
  }
};

export const publicApi = {
  link: async (token: string) => {
    const { data } = await api.get<ApiResponse<PublicLink>>(`/public/${token}`);
    return data.data;
  },
  dates: async (token: string) => {
    const { data } = await api.get<ApiResponse<string[]>>(`/public/${token}/available-dates`);
    return data.data;
  },
  slots: async (token: string, date: string) => {
    const { data } = await api.get<ApiResponse<PublicSlot[]>>(`/public/${token}/slots`, { params: { date } });
    return data.data;
  },
  book: async (
    token: string,
    payload: { date: string; start_time: string; end_time: string; visitor_name: string; visitor_email: string }
  ) => {
    const { data } = await api.post<ApiResponse<unknown>>(`/public/${token}/book`, payload);
    return data.data;
  }
};
