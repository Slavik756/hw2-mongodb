import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getContactById,
  getAllContacts,
  updateContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadsAvatarsDir } from '../utils/saveFileToUploadsAvatarsDir.js';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });



  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById({
    _id: contactId,
    userId: req.user.id,
  });

  if (!contact) {

    throw createHttpError(404, 'Contact not found');


  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadsAvatarsDir(photo);
    }
  }


  const contact = await createContact({
    ...req.body,
    userId: req.user.id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact({
    _id: contactId,
    userId: req.user.id,
  });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const photo = req.file;
  // console.log(photo);

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadsAvatarsDir(photo);
    }
  }

  const { contactId } = req.params;

  const result = await updateContact(
    {
      contactId,
      userId: req.user.id,
      payload: { ...req.body, photo: photoUrl },
    },
    { upsert: true },
  );

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const { contact, isNew } = result;
  const status = isNew ? 201 : 200;
  const message = isNew
    ? `Successfully created a contact!`
    : `Successfully updated a contact!`;

  res.status(status).json({
    status,
    message,
    isNew,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const photo = req.file;
  console.log(photo);

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadsAvatarsDir(photo);
    }
  }

  const { contactId } = req.params;
  const result = await updateContact({
    contactId,
    userId: req.user.id,
    payload: { ...req.body, photo: photoUrl },
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
