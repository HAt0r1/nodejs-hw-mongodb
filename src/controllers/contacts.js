import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contacts.js';

// GET Controllers
export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();

  if (!contacts) {
    next(createHttpError(404, 'Contacts not found'));
    return;
  }

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

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
  const contact = await createContact(req.body);

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
  const contact = await patchContact(contactId, req.body);

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

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
