import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  postContactController,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.post('/contacts', ctrlWrapper(postContactController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

export default router;
