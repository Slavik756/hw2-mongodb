import { json, Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getAllContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';

const router = Router();
const jsonParser = json();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.post('/', jsonParser, ctrlWrapper(createContactController));

router.put('/:contactId', jsonParser, ctrlWrapper(upsertContactController));

router.patch('/:contactId', jsonParser, ctrlWrapper(patchContactController));

export default router;
