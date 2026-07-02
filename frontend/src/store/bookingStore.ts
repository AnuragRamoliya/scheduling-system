import { create } from "zustand";
import type { PublicSlot } from "../types";

type BookingState = {
  selectedDate: string;
  selectedSlot: PublicSlot | null;
  setDate: (date: string) => void;
  setSlot: (slot: PublicSlot | null) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  selectedDate: "",
  selectedSlot: null,
  setDate: (selectedDate) => set({ selectedDate, selectedSlot: null }),
  setSlot: (selectedSlot) => set({ selectedSlot })
}));
