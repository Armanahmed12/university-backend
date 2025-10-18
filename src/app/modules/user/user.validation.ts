import { z } from 'zod';
import { UserStatus } from './user.constant.js';

export const userValidationSchema = z.object({
  password: z
    .string({
      error: 'This field must be a valid string.',
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});

export const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus]),
  }),
});
