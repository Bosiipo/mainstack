import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 7070,
  databaseUrl: process.env.DATABASE_URL,
  user: process.env.USERNAME,
  pass: process.env.PASSWORD,
  secretKey: process.env.SECRET,
};
