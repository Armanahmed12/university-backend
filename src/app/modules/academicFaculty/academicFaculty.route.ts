import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AcademicFacultyValidations } from './academicFaculty.validation.js';
import { AcademicFacultyControllers } from './academicFaculty.controller.js';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../user/user.constant.js';

const router = Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin),
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

router.get('/', auth(), AcademicFacultyControllers.getAllAcademicFaculties);

export const AcademicFacultyRoutes = router;
