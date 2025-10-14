import express from 'express';
import { StudentControllers } from './student.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { studentValidations } from './student.validation.js';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);

router.get('/:id', StudentControllers.getSingleStudent);

router.delete('/:id', StudentControllers.deleteStudent);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent
);

export const StudentRoutes = router;
