import * as dotenv from 'dotenv';
dotenv.config();

export const JWTCONFIG = {
  emailVerficiationSecret: process.env.EMAIL_VERIFICATION_SECRET_KEY,
  passwordResetEmailSecret: process.env.PASSWORD_RESET_EMAIL_SECRET_KEY,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_KEY,
};
