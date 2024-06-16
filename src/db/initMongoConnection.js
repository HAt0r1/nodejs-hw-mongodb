import mongoose from 'mongoose';
import constData from '../constans/mongoInfo.js';

const initMongoConnection = async () => {
  try {
    const { user, password, url, db } = constData();
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=hw2-mongodb`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(`Error to connect MongoDB database. Error: ${error.message}`);
  }
};

export default initMongoConnection;
