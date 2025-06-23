import cloudinary from 'cloudinary';

import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

import path from 'path';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const extension = path.extname(file.filename); // .jpg, .png, etc.
  const nameWithoutExt = path.basename(file.filename, extension);

  const parts = nameWithoutExt.split('-');

  const prefix1 = parts[0];
  const prefix2 = parts[1];

  const baseName = parts.slice(2).join('-');

  const finalName = `${baseName}_${prefix1}-${prefix2}`;

  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'projects/node-js-mongodb/contacts/avatars', // або своя логіка папок
    public_id: finalName,

  });


  await fs.unlink(file.path);
  return response.secure_url;
};
