import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { FacultyControllers } from './faculty.controller.js';
import { updateFacultyValidationSchema } from './faculty.validation.js';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../user/user.constant.js';

const router = express.Router();

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FacultyControllers.getSingleFaculty
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FacultyControllers.deleteFaculty
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FacultyControllers.getAllFaculties
);

export const FacultyRoutes = router;
