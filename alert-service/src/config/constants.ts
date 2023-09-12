import * as dotenv from 'dotenv';
dotenv.config();

export const JWTCONFIG = {
  emailVerficiationSecret: process.env.EMAIL_VERIFICATION_SECRET_KEY,
  passwordResetEmailSecret: process.env.PASSWORD_RESET_EMAIL_SECRET_KEY,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_KEY,
};

export const SCRAPPER_URLS = {
  petAlert: 'http://pet-alert-scraper:3000/start-scraping',
  otherSite: 'https://localhost:8087/start-scraping',
};
