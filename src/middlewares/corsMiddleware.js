import cors from 'cors';
import { getEnvVar } from '../utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', 3000));

const allowedOrigins = [
  `http://localhost:${PORT}`,
  `http://localhost:3000`,
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
});
