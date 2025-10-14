import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { SemesterRegistrationController } from './semesterRegistration.controller.js';
import { SemesterRegistrationValidations } from './semesterRegistration.validation.js';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration
);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.updateSemesterRegistration
);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration
);

//you should not delete semesterRegistration bcz a lot of things depend on it!
router.delete(
  '/:id',
  SemesterRegistrationController.deleteSemesterRegistration
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

export const semesterRegistrationRoutes = router;
