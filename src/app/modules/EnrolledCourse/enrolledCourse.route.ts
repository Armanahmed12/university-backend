import express from 'express';
import auth from '../../middlewares/auth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { EnrolledCourseControllers } from './enrolledCourse.controller.js';
import { EnrolledCourseValidations } from './enrolledCourse.validaton.js';
import { USER_ROLE } from '../user/user.constant.js';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);
router.get(
  '/my-enrolled-courses',
  auth(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses
);
router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
