import createHttpError from 'http-errors';
import setFileToCloudinary from '../utils/cloudinary.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortedParams } from '../utils/parseSortedParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// GET Controllers
export const getAllContactsController = async (req, res, next) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortedParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  if (!contacts) {
    next(createHttpError(404, 'Contacts not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById({ contactId, userId });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: res.statusCode,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// POST Controller

export const postContactController = async (req, res, next) => {
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;
  if (photo) photoUrl = await setFileToCloudinary(photo);
  const contact = await createContact({ ...req.body, userId, photo: photoUrl });

  if (!contact) {
    next(createHttpError(404, 'Can not create contact. Check your data'));
    return;
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

// PATCH Controller

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;
  if (photo) photoUrl = await setFileToCloudinary(photo);

  const contact = await patchContact({
    contactId,
    userId,
    payload: { ...req.body, photo: photoUrl },
  });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

// DELETE Controller

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact({ contactId, userId });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
