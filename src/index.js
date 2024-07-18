import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import checkFileIfExist from './utils/checkFileIfExist.js';
import { UPLOAD_DIR } from './constans/links.js';

const boostTrap = async () => {
  await initMongoConnection();
  await checkFileIfExist(UPLOAD_DIR);
  setupServer();
};

boostTrap();
