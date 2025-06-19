import { Router } from 'express';

import contactsRoutes from './contacts.js';

const router = Router();

router.use('/contacts', contactsRoutes);

export default router;
