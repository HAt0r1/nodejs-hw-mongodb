import express from 'express';
import {
  registrationValidation,
  loginValidation,
  resetEmailValidation,
  resetPasswordValidation,
} from '../validation/auth.js';
import { validateBody } from '../utils/validationBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  refreshSessionController,
  registrationUserController,
  loginUserController,
  logoutUserController,
  resetEmailController,
  resetPasswordController,
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

router.post(
  '/send-reset-email',
  validateBody(resetEmailValidation),
  ctrlWrapper(resetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordValidation),
  ctrlWrapper(resetPasswordController),
);

export default router;
