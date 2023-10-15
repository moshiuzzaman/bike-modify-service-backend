import { z } from 'zod';
import { userRole } from './auth.constant';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const registerZodSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
  name: z.string({
    required_error: 'Name is required',
  }),
  address: z.string({
    required_error: 'Address is required',
  }),
  role: z.enum([...userRole] as [string, ...string[]]).optional( ),
});

export const AuthValidation = {
  login: loginZodSchema,
  register: registerZodSchema,
};
