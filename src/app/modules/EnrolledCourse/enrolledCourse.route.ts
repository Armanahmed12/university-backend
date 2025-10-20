import express from 'express';
import auth from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { EnrolledCourseControllers } from './enrolledCourse.controller.js';
import { EnrolledCourseValidations } from './enrolledCourse.validaton.js';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.patch(
  '/update-enrolled-course-marks',
  auth('faculty'),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
