import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const REGISTERED_SERVICES: ClientsModuleOptions = [
  {
    name: 'ACCOUNT_SERVICE',
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOSTNAME}`,
      ],
      queue: process.env.RABBITMQ_ACCOUNT_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  },
  {
    name: 'ALERT_SERVICE',
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOSTNAME}`,
      ],
      queue: process.env.RABBITMQ_ALERT_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  },
];
