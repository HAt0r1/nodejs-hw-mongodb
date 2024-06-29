import paginationData from '../utils/calculationPaginationData.js';
import { Contact } from '../db/model/Contact.js';

export const getAllContacts = async ({ page, perPage }) => {
  const skip = (page - 1) * perPage;
  const totalItems = await Contact.countDocuments();
  const contactItems = await Contact.find().skip(skip).limit(perPage);
  const paginationInfo = paginationData(totalItems, page, perPage);

  return {
    data: contactItems,
    ...paginationInfo,
  };
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload, options = {}) => {
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, payload, {
    ...options,
  });
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId });
  return contact;
};
