import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AcademicDepartmentValidations } from './academicDepartment.validation.js';
import { AcademicDepartmentControllers } from './academicDepartment.controller.js';

const router = Router();

router.post(
  '/create-academic-department',
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment
);

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

export const AcademicDepartmentRoutes = router;
