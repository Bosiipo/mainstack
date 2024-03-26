import mongoose from 'mongoose';
import {config} from '../config';

export const connectMongoose = async () => {
  try {
    await mongoose.connect(config.databaseUrl!);
    console.log('mongoose.js: ' + 'Successfully connected to mongo database!!');
  } catch (error) {
    console.log(error);
  }
};
