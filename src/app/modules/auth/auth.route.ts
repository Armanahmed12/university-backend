import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AtuhValidation } from './auth.validation.js';
import { AuthControllers } from './auth.controller.js';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../user/user.constant.js';

const router = Router();

router.post(
  '/login',
  validateRequest(AtuhValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  '/change-password',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  validateRequest(AtuhValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  '/refresh-token',
  validateRequest(AtuhValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post(
  '/forget-password',
  validateRequest(AtuhValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);

router.post(
  '/reset-password',
  validateRequest(AtuhValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
