import { z } from "zod";
import { dateString, futureDateString, timeRangeRefinement, timeString, uuidParam } from "./common";

export const createAvailabilitySchema = z
  .object({
    body: z.object({
      date: futureDateString,
      start_time: timeString,
      end_time: timeString
    })
  })
  .refine((value) => timeRangeRefinement(value.body), {
    message: "start_time must be before end_time",
    path: ["body", "start_time"]
  });

export const deleteAvailabilitySchema = z.object({
  params: z.object({
    id: uuidParam
  })
});

export const listAvailabilitySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
    date: dateString.optional()
  })
});
