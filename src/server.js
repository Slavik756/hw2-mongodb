import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config();

import express from 'express';
// import cors from 'cors';
// import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';

import { corsMiddleware } from './middlewares/corsMiddleware.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

import routes from './routers/index.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

// import { AVATARS_DIR } from './constants/index.js';
import path from 'node:path';

const PORT = getEnvVar('PORT', 3000);

export const startServer = () => {
  const app = express();

  app.use(corsMiddleware);

  app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  app.use(
    '/uploads/avatars',
    express.static(path.resolve('uploads', 'avatars')),
  );

  app.use(routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (err) => {
    if (err) {
      throw err;
    }

    console.log(`Server is running on port ${PORT}`);
  });
};
