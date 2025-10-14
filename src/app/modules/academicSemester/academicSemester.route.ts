import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { academicSemesterValidations } from './academicSemester.validation.js';
import { AcademicSemesterControllers } from './academicSemester.controller.js';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(academicSemesterValidations.createAcademicSemesterValidation),
  AcademicSemesterControllers.createAcademicSemester
);

router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester
);

router.get('/', AcademicSemesterControllers.getAllAcademicSemesters);

router.patch(
  '/:semesterId',
  validateRequest(academicSemesterValidations.updateAcademicSemesterValidation),
  AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicSemesterRoutes = router;
