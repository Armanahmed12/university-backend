import express from 'express';
import { StudentControllers } from './student.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { studentValidations } from './student.validation.js';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../user/user.constant.js';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.getAllStudents
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.getSingleStudent
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.deleteStudent
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent
);

export const StudentRoutes = router;
