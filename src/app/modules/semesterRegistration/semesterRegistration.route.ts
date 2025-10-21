import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { SemesterRegistrationController } from './semesterRegistration.controller.js';
import { SemesterRegistrationValidations } from './semesterRegistration.validation.js';
import { USER_ROLE } from '../user/user.constant.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  SemesterRegistrationController.getSingleSemesterRegistration
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.updateSemesterRegistration
);

//you should not delete semesterRegistration bcz a lot of things depend on it!
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationController.deleteSemesterRegistration
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  SemesterRegistrationController.getAllSemesterRegistrations
);

export const semesterRegistrationRoutes = router;
