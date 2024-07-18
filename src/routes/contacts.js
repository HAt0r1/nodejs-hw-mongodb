import express from 'express';
import upload from '../utils/multerConfig.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  postContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import {
  createStudentSchema,
  updateStudentSchema,
} from '../validation/contacts.js';
import { validateBody } from '../utils/validationBody.js';
import { validateId } from '../middlewares/validateId.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createStudentSchema),
  ctrlWrapper(postContactController),
);

router.get('/:contactId', validateId, ctrlWrapper(getContactByIdController));

router.patch(
  '/:contactId',
  validateId,
  upload.single('photo'),
  validateBody(updateStudentSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', validateId, ctrlWrapper(deleteContactController));

export default router;
