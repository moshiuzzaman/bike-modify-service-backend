
import { z } from 'zod';

const create = z.object({
        title: z.string({
            required_error: 'Service title is required'
        }),
        description: z.string({
            required_error: 'Description is required'
        }),
        price: z.number({
            required_error: 'Price is required'
        }),
        length: z.number({
            required_error: 'Length is required'
        }),
        
        features: z.array(z.string()).min(1)
   
});

const update = z.object({
        title: z.string().optional(),
        
        description: z.string().optional(),
        price: z.number().optional(),
        length: z.number().optional(),
        features: z.array(z.string()).min(1).optional()
    
});

export const ServiceValidation = {
    create,
    update
};