import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route.js';
import { UserRouter } from '../modules/user/user.route.js';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route.js';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route.js';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route.js';
import { FacultyRoutes } from '../modules/faculty/faculty.route.js';
import { AdminRoutes } from '../modules/admin/admin.route.js';
import { CourseRoutes } from '../modules/course/course.route.js';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route.js';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.route.js';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { EnrolledCourseRoutes } from '../modules/EnrolledCourse/enrolledCourse.route.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/enrolled-courses',
    route: EnrolledCourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
