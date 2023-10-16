

import { z } from 'zod';

const createReviewZodSchema = z.object({
    body: z.object({
        bookingId: z.string({
            required_error: 'bookingId  is required',
        }),
        rating: z.number({
            required_error: 'Rating is required',
        }),
        comment: z.string({
            required_error: 'Comment is required',
        }),
    }),
});

export const ReviewValidation = {
    create: createReviewZodSchema,
};