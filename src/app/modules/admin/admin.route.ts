import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AdminControllers } from './admin.controller.js';
import { updateAdminValidationSchema } from './admin.validation.js';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../user/user.constant.js';

const router = express.Router();

router.get('/', auth(USER_ROLE.superAdmin, USER_ROLE.admin) , AdminControllers.getAllAdmins);

router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin) , AdminControllers.getSingleAdmin);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin
);

router.delete('/:adminId', auth(USER_ROLE.superAdmin) ,AdminControllers.deleteAdmin);

export const AdminRoutes = router;
