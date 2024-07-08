import express from 'express';
import { registrationValidation, loginValidation } from '../validation/auth.js';
import { validateBody } from '../utils/validationBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  refreshSessionController,
  registrationUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registrationValidation),
  ctrlWrapper(registrationUserController),
);

router.post(
  '/login',
  validateBody(loginValidation),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
