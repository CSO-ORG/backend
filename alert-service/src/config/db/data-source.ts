import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: ['migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
};

switch (process.env.NODE_ENV) {
  case 'development':
    console.log('===== DEVELOPMENT MODE');
    Object.assign(dataSourceOptions, {
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });
    break;
  case 'production':
    console.log('===== PRODUCTION MODE....');
    Object.assign(dataSourceOptions, {
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });
    break;
  default:
    throw new Error('NODE_ENV is not set');
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
