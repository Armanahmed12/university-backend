import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { FacultyControllers } from './faculty.controller.js';
import { updateFacultyValidationSchema } from './faculty.validation.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete('/:id', FacultyControllers.deleteFaculty);

router.get('/', auth('faculty', 'admin'), FacultyControllers.getAllFaculties);

export const FacultyRoutes = router;
