import * as dotenv from 'dotenv';
dotenv.config();

export const JWTCONFIG = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_KEY,
};
