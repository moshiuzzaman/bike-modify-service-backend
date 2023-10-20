
import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: 'Service is required',
    }),
    date: z.string({
      required_error: ' date is required',
    }),
    time:z.string({
      required_error: 'time is required',
    }),
    
  }),
});

// update all fields are optional

const updateBookingZodSchema = z.object({
  body: z.object({
    serviceId: z.string().optional(),
    date: z.string().optional(),
    time:z.string().optional(),
  }),
});

export const BookingValidation = {
  create: createBookingZodSchema,
  update: updateBookingZodSchema,
};