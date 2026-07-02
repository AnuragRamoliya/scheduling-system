import { z } from "zod";
import { isPastDate, minutesFromTime } from "../utils/time";

export const uuidParam = z.string().uuid();
export const tokenParam = z.string().min(8).max(100).regex(/^[A-Za-z0-9_-]+$/);
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const futureDateString = dateString.refine((date) => !isPastDate(date), "Date cannot be in the past");
export const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/);

export const timeRangeRefinement = (value: { start_time: string; end_time: string }) =>
  minutesFromTime(value.start_time) < minutesFromTime(value.end_time);
