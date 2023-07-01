import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const REGISTERED_SERVICES: ClientsModuleOptions = [
  {
    name: 'ACCOUNT_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOSTNAME}`,
      ],
      queue: process.env.RABBITMQ_ACCOUNT_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  },
];
