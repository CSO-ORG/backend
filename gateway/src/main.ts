import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(json({ limit: '2gb' }));
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.CURRENT_API_VERSION,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CSOPETFINDER API')
    .setDescription('API Endpoints')
    .setVersion(process.env.CURRENT_API_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
