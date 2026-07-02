import { z } from "zod";
import { dateString, futureDateString, timeRangeRefinement, timeString, tokenParam } from "./common";

export const publicTokenSchema = z.object({
  params: z.object({
    token: tokenParam
  })
});

export const availableSlotsSchema = z.object({
  params: z.object({
    token: tokenParam
  }),
  query: z.object({
    date: dateString
  })
});

export const createBookingSchema = z
  .object({
    params: z.object({
      token: tokenParam
    }),
    body: z.object({
      date: futureDateString,
      start_time: timeString,
      end_time: timeString,
      visitor_name: z.string().trim().min(2).max(120),
      visitor_email: z.string().trim().email().toLowerCase()
    })
  })
  .refine((value) => timeRangeRefinement(value.body), {
    message: "start_time must be before end_time",
    path: ["body", "start_time"]
  });
