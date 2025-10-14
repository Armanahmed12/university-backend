import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { studentValidations } from '../student/student.validation.js';
import { createAdminValidationSchema } from '../admin/admin.validation.js';
import { createFacultyValidationSchema } from '../faculty/faculty.validation.js';
import { UserControllers } from './user.controller.js';
import auth from '../../middlewares/auth.js';

const router = Router();

router.post(
  '/create-student',
  auth('admin'),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  '/create-faculty',
  auth('admin'),
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  '/create-admin',
  // auth('admin'),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin
);

export const UserRouter = router;
