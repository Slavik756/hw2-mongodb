
import { initMongoConnection } from './db/initMongoDB.js';
import { startServer } from './server.js';

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import {
  AVATARS_DIR,
  TEMP_UPLOAD_DIR,
  UPLOAD_DIR,
} from './constants/index.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();

    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await createDirIfNotExists(AVATARS_DIR);

    startServer();
  } catch (error) {
    console.log(error);
  }
};

void bootstrap();
