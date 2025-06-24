import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import { SWAGGER_PATH } from '../constants/index.js';

let swaggerDoc;

try {
  const data = fs.readFileSync(SWAGGER_PATH, 'utf-8');
  swaggerDoc = JSON.parse(data);
} catch (err) {
  console.error('❌ Swagger JSON load error:', err.message);
  swaggerDoc = null;
}

export const serveSwagger = swaggerUI.serve;

export const setupSwagger = (req, res, next) => {
  if (!swaggerDoc) {
    return next(createHttpError(500, "Can't load Swagger docs"));
  }
  return swaggerUI.setup(swaggerDoc)(req, res, next);
};
