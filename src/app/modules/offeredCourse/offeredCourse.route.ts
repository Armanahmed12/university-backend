import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { OfferedCourseControllers } from './offeredCourse.controller.js';
import { OfferedCourseValidations } from './offeredCourse.validation.js';
import { USER_ROLE } from '../user/user.constant.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  OfferedCourseControllers.getAllOfferedCourses
);

router.get(
  '/my-offered-courses',
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses
);

router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  OfferedCourseControllers.getSingleOfferedCourses
);

router.post(
  '/create-offered-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  OfferedCourseControllers.deleteOfferedCourseFromDB
);

export const offeredCourseRoutes = router;
