import 'dotenv/config';

import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';

import { corsMiddleware } from './middlewares/corsMiddleware.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

import routes from './routers/index.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import path from 'node:path';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = getEnvVar('PORT', 8080);

export const startServer = () => {
  const app = express();

  app.use(corsMiddleware);

  app.use(loggerMiddleware);

  app.use(
    '/uploads/avatars',
    express.static(path.resolve('uploads', 'avatars')),
  );

  app.use('/api-docs', ...swaggerDocs());

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
