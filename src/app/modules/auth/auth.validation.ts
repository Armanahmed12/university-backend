import z from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'Id is required'),
    password: z.string().min(1, 'password is required'),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(1, 'new password is required'),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'User id is required'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'user is is required!'),
    newPassword: z.string().min(1, ' User new pasword is required!'),
  }),
});

export const AtuhValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
