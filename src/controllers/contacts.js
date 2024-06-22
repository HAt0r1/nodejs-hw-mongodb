import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
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

export const createContactController = async (req, res, next) => {
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
