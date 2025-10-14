import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AtuhValidation } from './auth.validation.js';
import { AuthControllers } from './auth.controller.js';
import auth from '../../middlewares/auth.js';

const router = Router();

router.post(
  '/login',
  validateRequest(AtuhValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  '/change-password',
  auth('admin', 'faculty', 'student'),
  validateRequest(AtuhValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  '/refresh-token',
  validateRequest(AtuhValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export const AuthRoutes = router;
