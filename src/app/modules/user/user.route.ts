import { NextFunction, Request, Response, Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { studentValidations } from '../student/student.validation.js';
import { createAdminValidationSchema } from '../admin/admin.validation.js';
import { createFacultyValidationSchema } from '../faculty/faculty.validation.js';
import { UserControllers } from './user.controller.js';
import auth from '../../middlewares/auth.js';
import { changeStatusValidationSchema } from './user.validation.js';
import { upload } from '../../utils/sendImageToCloudinary.js';

const router = Router();

router.post(
  '/create-student',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  '/create-faculty',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  '/create-admin',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin
);

router.get('/me', auth('admin', 'faculty', 'student'), UserControllers.getMe);

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(changeStatusValidationSchema),
  UserControllers.changeStatus
);

export const UserRouter = router;
