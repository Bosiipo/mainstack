import mongoose from 'mongoose';
import {config} from '../config';

export const connectMongoose = async () => {
  try {
    // console.log("DB ==>", DB_CONFIG);
    await mongoose.connect(config.databaseUrl);
    console.log('mongoose.js: ' + 'Successfully connected to mongo database!!');
  } catch (error) {
    console.log('Error on mongoose connection', error.message);
    console.log(error);
  }
};
