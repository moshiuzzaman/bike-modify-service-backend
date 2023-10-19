
import { z } from 'zod';

const create = z.object({
        title: z.string({
            required_error: 'Service title is required'
        }),
        description: z.string({
            required_error: 'Description is required'
        }),
        price: z.string({
            required_error: 'Price is required'
        }),
        length: z.string({
            required_error: 'Length is required'
        }),
        status: z.string({
            required_error: 'Status is required'
        }),
        
       
   
});

const update = z.object({
        title: z.string().optional(),
        
        description: z.string().optional(),
        price: z.string().optional(),
        length: z.string().optional(),
        features: z.array(z.string()).min(1).optional(),
        status: z.string().optional(),

});

export const ServiceValidation = {
    create,
    update
};