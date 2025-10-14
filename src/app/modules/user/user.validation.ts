import { z } from 'zod';

export const userValidationSchema = z.object({
  password: z
    .string({
      error: 'This field must be a valid string.',
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});
