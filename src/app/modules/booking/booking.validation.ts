
import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: 'Service is required',
    }),
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
  }),
});

// update all fields are optional

const updateBookingZodSchema = z.object({
  body: z.object({
    serviceId: z.string().optional(),
    startDate: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const BookingValidation = {
  create: createBookingZodSchema,
  update: updateBookingZodSchema,
};