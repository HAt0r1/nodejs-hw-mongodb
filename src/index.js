import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

const boostTrap = async () => {
  await initMongoConnection();
  setupServer();
};

boostTrap();
