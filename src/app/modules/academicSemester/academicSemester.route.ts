import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { academicSemesterValidations } from './academicSemester.validation.js';
import { AcademicSemesterControllers } from './academicSemester.controller.js';
import { USER_ROLE } from '../user/user.constant.js';
import auth from '../../middlewares/auth.js';

const router = Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicSemesterValidations.createAcademicSemesterValidation),
  AcademicSemesterControllers.createAcademicSemester
);

router.get(
  '/:semesterId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  AcademicSemesterControllers.getSingleAcademicSemester
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  AcademicSemesterControllers.getAllAcademicSemesters
);

router.patch(
  '/:semesterId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicSemesterValidations.updateAcademicSemesterValidation),
  AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicSemesterRoutes = router;
