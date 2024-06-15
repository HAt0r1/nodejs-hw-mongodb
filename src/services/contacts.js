import { ContactModel } from '../db/model/Contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactModel.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactModel.findById(contactId);
  return contact;
};
