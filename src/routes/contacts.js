import express from 'express';
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

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.post(
  '/contacts',
  validateBody(createStudentSchema),
  ctrlWrapper(postContactController),
);

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.patch(
  '/contacts/:contactId',
  validateBody(updateStudentSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
