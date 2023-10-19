
import { z } from 'zod';
import { userRole } from '../auth/auth.constants';

const update = z.object({
    email: z.string( ).optional( ),
    password: z.string( ).optional( ),
    name: z.string( ).optional( ),
    address: z.string( ).optional(),
    role: z.enum([...userRole] as [string, ...string[]]).optional( ),
  });

export const UserValidation = {
    update,
};