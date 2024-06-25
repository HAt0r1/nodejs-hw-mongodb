import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  postContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.post('/contacts', ctrlWrapper(postContactController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
