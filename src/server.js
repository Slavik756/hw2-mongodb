import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { corsMiddleware } from './middlewares/corsMiddleware.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

import dotenv from 'dotenv';
import routes from './routers/index.js';
dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(corsMiddleware);

  app.use(loggerMiddleware);


  app.use(routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (err) => {
    if (err) {
      throw err;
    }

    console.log(`Server is running on port: ${PORT}`);
  });
};
