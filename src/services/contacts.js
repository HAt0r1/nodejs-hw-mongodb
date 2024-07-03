import paginationData from '../utils/calculationPaginationData.js';
import { Contact } from '../db/model/Contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = Contact.find();
  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const totalItems = await Contact.find().merge(contactQuery).countDocuments();
  const contactItems = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

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
