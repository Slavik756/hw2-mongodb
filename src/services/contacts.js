
import { ContactsCollection } from '../db/models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
  userId,
}) => {
  const limit = perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  const { type, isFavourite } = filter;
  if (type) {
    contactsQuery.where('contactType').equals(type);
  }
  if (typeof isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(isFavourite);
  }

  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find({ userId }).merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async ({ contactId, userId }) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async ({ payload, userId }) => {
  const student = await ContactsCollection.create({ ...payload, userId });
  return student;
};

export const deleteContact = async ({ contactId, userId }) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};

export const updateContact = async (
  { contactId, userId, payload },
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );



  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    // isNew: Boolean(!rawResult?.lastErrorObject?.updatedExisting),
  };
};
