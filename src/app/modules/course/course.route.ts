import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { CourseValidations } from './course.validation.js';
import { CourseControllers } from './course.controller.js';
import auth from '../../middlewares/auth.js';

const router = Router();

router.post(
  '/create-course',
  auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get(
  '/:id',
  auth('student', 'admin', 'faculty'),
  CourseControllers.getSingleCourse
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

router.delete('/:id', auth('admin'), CourseControllers.deleteCourse);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse
);

router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router;
