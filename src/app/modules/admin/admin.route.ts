import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AdminControllers } from './admin.controller.js';
import { updateAdminValidationSchema } from './admin.validation.js';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getSingleAdmin);

router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin
);

router.delete('/:adminId', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
