import { create } from "zustand";
import type { AvailabilitySlot } from "../types";

type AvailabilityState = {
  slots: AvailabilitySlot[];
  addSlot: (slot: AvailabilitySlot) => void;
  clear: () => void;
};

export const useAvailabilityStore = create<AvailabilityState>((set) => ({
  slots: [],
  addSlot: (slot) => set((state) => ({ slots: [...state.slots, slot] })),
  clear: () => set({ slots: [] })
}));
